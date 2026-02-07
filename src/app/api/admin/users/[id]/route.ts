import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin, logActivity } from "@/lib/admin";
import { z } from "zod";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        buyerProfile: {
          include: {
            zones: true,
            matches: {
              take: 10,
              orderBy: { createdAt: "desc" },
              include: {
                property: {
                  select: { commune: true, askingPrice: true, propertyType: true },
                },
              },
            },
          },
        },
        sellerProfile: {
          include: {
            properties: {
              include: {
                matches: {
                  take: 10,
                  orderBy: { createdAt: "desc" },
                  include: {
                    buyerProfile: {
                      include: { user: { select: { firstName: true, lastName: true } } },
                    },
                  },
                },
              },
            },
          },
        },
        agentProfile: {
          include: { zones: true },
        },
        payments: {
          take: 20,
          orderBy: { createdAt: "desc" },
        },
        notifications: {
          take: 10,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur serveur";
    if (message === "UNAUTHORIZED" || message === "FORBIDDEN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

const updateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  isDisabled: z.boolean().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const data = updateUserSchema.parse(body);

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    const user = await prisma.user.update({
      where: { id },
      data,
    });

    await logActivity(
      data.isDisabled !== undefined ? "user.status_changed" : "user.updated",
      "User",
      id,
      session.user.id,
      { changes: Object.keys(data) }
    );

    return NextResponse.json({ message: "Utilisateur mis à jour", user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides", details: error.issues }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Erreur serveur";
    if (message === "UNAUTHORIZED" || message === "FORBIDDEN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
