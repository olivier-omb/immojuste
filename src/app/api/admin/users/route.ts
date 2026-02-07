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
    const role = searchParams.get("role");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";

    const where: Prisma.UserWhereInput = {};

    if (role && ["BUYER", "SELLER", "AGENT", "ADMIN"].includes(role)) {
      where.role = role as Prisma.EnumUserRoleFilter;
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
      ];
    }

    const validSortFields = ["createdAt", "email", "firstName", "role"];
    const sortField = validSortFields.includes(sort) ? sort : "createdAt";
    const sortOrder = order === "asc" ? "asc" : "desc";

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortField]: sortOrder },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isDisabled: true,
          createdAt: true,
          _count: {
            select: {
              payments: true,
              notifications: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
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
