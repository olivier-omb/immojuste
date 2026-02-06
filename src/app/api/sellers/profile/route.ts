import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "SELLER") {
      return NextResponse.json(
        { error: "Accès réservé aux vendeurs" },
        { status: 403 }
      );
    }

    const profile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        properties: {
          select: {
            id: true,
            commune: true,
            askingPrice: true,
            isActive: true,
            _count: {
              select: { matches: true },
            },
          },
        },
        _count: {
          select: { properties: true },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profil non trouvé" }, { status: 404 });
    }

    // Count unlocked matches
    const unlockedMatchesCount = await prisma.match.count({
      where: {
        property: {
          sellerProfileId: profile.id,
        },
        sellerUnlocked: true,
      },
    });

    return NextResponse.json({
      ...profile,
      unlockedMatchesCount,
    });
  } catch (error) {
    console.error("Get seller profile error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
