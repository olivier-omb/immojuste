import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const action = searchParams.get("action");

    const where = action ? { action: { contains: action } } : {};

    const [activities, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true },
          },
        },
      }),
      prisma.activityLog.count({ where }),
    ]);

    return NextResponse.json({
      activities,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur serveur";
    if (message === "UNAUTHORIZED" || message === "FORBIDDEN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
