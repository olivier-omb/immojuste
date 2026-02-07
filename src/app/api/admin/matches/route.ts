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
    const grade = searchParams.get("grade");
    const status = searchParams.get("status");

    const where: Prisma.MatchWhereInput = {};

    if (grade && ["A", "B", "C"].includes(grade)) {
      where.compatibilityGrade = grade as "A" | "B" | "C";
    }

    if (status) {
      where.status = status as Prisma.EnumMatchStatusFilter;
    }

    const [matches, total] = await Promise.all([
      prisma.match.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          buyerProfile: {
            include: {
              user: { select: { firstName: true, lastName: true, email: true } },
            },
          },
          property: {
            select: {
              commune: true,
              postalCode: true,
              askingPrice: true,
              propertyType: true,
              sellerProfile: {
                include: {
                  user: { select: { firstName: true, lastName: true, email: true } },
                },
              },
            },
          },
          payment: {
            select: { amount: true, status: true, createdAt: true },
          },
        },
      }),
      prisma.match.count({ where }),
    ]);

    return NextResponse.json({
      matches,
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
