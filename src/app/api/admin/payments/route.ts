import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    const where: Prisma.PaymentWhereInput = {};

    if (type && ["SELLER_SINGLE_UNLOCK", "AGENT_SUBSCRIPTION"].includes(type)) {
      where.type = type as Prisma.EnumPaymentTypeFilter;
    }

    if (status && ["PENDING", "COMPLETED", "FAILED", "REFUNDED"].includes(status)) {
      where.status = status as Prisma.EnumPaymentStatusFilter;
    }

    const [payments, total, totalRevenue, revenueByType] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true, role: true },
          },
        },
      }),
      prisma.payment.count({ where }),
      prisma.payment.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
        _count: true,
        _avg: { amount: true },
      }),
      Promise.all([
        prisma.payment.aggregate({
          where: { status: "COMPLETED", type: "SELLER_SINGLE_UNLOCK" },
          _sum: { amount: true },
          _count: true,
        }),
        prisma.payment.aggregate({
          where: { status: "COMPLETED", type: "AGENT_SUBSCRIPTION" },
          _sum: { amount: true },
          _count: true,
        }),
      ]),
    ]);

    return NextResponse.json({
      payments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      summary: {
        totalRevenue: (totalRevenue._sum.amount || 0) / 100,
        totalPayments: totalRevenue._count,
        averagePayment: Math.round((totalRevenue._avg.amount || 0)) / 100,
        sellerUnlocks: {
          revenue: (revenueByType[0]._sum.amount || 0) / 100,
          count: revenueByType[0]._count,
        },
        agentSubscriptions: {
          revenue: (revenueByType[1]._sum.amount || 0) / 100,
          count: revenueByType[1]._count,
        },
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
