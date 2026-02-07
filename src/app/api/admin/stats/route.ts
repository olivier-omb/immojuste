import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  try {
    await requireAdmin();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);

    const [
      totalUsers,
      buyerCount,
      sellerCount,
      agentCount,
      adminCount,
      newUsersThisWeek,
      newUsersThisMonth,
      totalMatches,
      matchesGradeA,
      matchesGradeB,
      matchesGradeC,
      unlockedMatches,
      totalProperties,
      activeProperties,
      paymentStats,
      revenueThisMonth,
      recentPayments,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "BUYER" } }),
      prisma.user.count({ where: { role: "SELLER" } }),
      prisma.user.count({ where: { role: "AGENT" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.user.count({ where: { createdAt: { gte: startOfWeek } } }),
      prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.match.count(),
      prisma.match.count({ where: { compatibilityGrade: "A" } }),
      prisma.match.count({ where: { compatibilityGrade: "B" } }),
      prisma.match.count({ where: { compatibilityGrade: "C" } }),
      prisma.match.count({ where: { sellerUnlocked: true } }),
      prisma.property.count(),
      prisma.property.count({ where: { isActive: true } }),
      prisma.payment.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.payment.aggregate({
        where: { status: "COMPLETED", createdAt: { gte: startOfMonth } },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.payment.findMany({
        where: { status: "COMPLETED" },
        orderBy: { createdAt: "desc" },
        take: 6,
        select: { amount: true, createdAt: true, type: true },
      }),
    ]);

    // Revenue by month (last 6 months)
    const revenueByMonth: { month: string; revenue: number; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthData = await prisma.payment.aggregate({
        where: {
          status: "COMPLETED",
          createdAt: { gte: monthStart, lt: monthEnd },
        },
        _sum: { amount: true },
        _count: true,
      });
      const monthLabel = monthStart.toLocaleDateString("fr-BE", { month: "short", year: "numeric" });
      revenueByMonth.push({
        month: monthLabel,
        revenue: (monthData._sum.amount || 0) / 100,
        count: monthData._count,
      });
    }

    const totalRevenue = (paymentStats._sum.amount || 0) / 100;
    const revenueMonth = (revenueThisMonth._sum.amount || 0) / 100;
    const conversionRate = totalMatches > 0
      ? Math.round((unlockedMatches / totalMatches) * 100)
      : 0;

    return NextResponse.json({
      users: {
        total: totalUsers,
        buyers: buyerCount,
        sellers: sellerCount,
        agents: agentCount,
        admins: adminCount,
        newThisWeek: newUsersThisWeek,
        newThisMonth: newUsersThisMonth,
      },
      matches: {
        total: totalMatches,
        gradeA: matchesGradeA,
        gradeB: matchesGradeB,
        gradeC: matchesGradeC,
        unlocked: unlockedMatches,
        conversionRate,
      },
      properties: {
        total: totalProperties,
        active: activeProperties,
      },
      revenue: {
        total: totalRevenue,
        thisMonth: revenueMonth,
        totalPayments: paymentStats._count,
        paymentsThisMonth: revenueThisMonth._count,
        byMonth: revenueByMonth,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur serveur";
    if (message === "UNAUTHORIZED" || message === "FORBIDDEN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
