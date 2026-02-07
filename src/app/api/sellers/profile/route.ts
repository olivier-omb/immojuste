import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const sellerProfileSchema = z.object({
  phone: z.string().optional(),
  visitAvailability: z.string().optional(),
  immwebLink: z.string().optional(),
  consentTerms: z.boolean().optional(),
  consentPrivacy: z.boolean().optional(),
  consentMarketing: z.boolean().optional(),
});

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

    // Get user info for phone/consents
    const userInfo = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { phone: true, consentTerms: true, consentPrivacy: true, consentMarketing: true },
    });

    return NextResponse.json({
      ...profile,
      unlockedMatchesCount,
      phone: userInfo?.phone || null,
      consentTerms: userInfo?.consentTerms || false,
      consentPrivacy: userInfo?.consentPrivacy || false,
      consentMarketing: userInfo?.consentMarketing || false,
    });
  } catch (error) {
    console.error("Get seller profile error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
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
      return NextResponse.json({ error: "Accès réservé aux vendeurs" }, { status: 403 });
    }

    const body = await req.json();
    const data = sellerProfileSchema.parse(body);

    // Update User fields
    const userUpdate: Record<string, unknown> = {};
    if (data.phone !== undefined) userUpdate.phone = data.phone;
    if (data.consentTerms !== undefined) userUpdate.consentTerms = data.consentTerms;
    if (data.consentPrivacy !== undefined) userUpdate.consentPrivacy = data.consentPrivacy;
    if (data.consentMarketing !== undefined) userUpdate.consentMarketing = data.consentMarketing;

    if (Object.keys(userUpdate).length > 0) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: userUpdate,
      });
    }

    // Update SellerProfile fields
    const profileUpdate: Record<string, unknown> = {};
    if (data.visitAvailability !== undefined) profileUpdate.visitAvailability = data.visitAvailability;
    if (data.immwebLink !== undefined) profileUpdate.immwebLink = data.immwebLink;

    let profile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (profile && Object.keys(profileUpdate).length > 0) {
      profile = await prisma.sellerProfile.update({
        where: { id: profile.id },
        data: profileUpdate,
      });
    }

    return NextResponse.json({ message: "Profil mis à jour", profile });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides", details: error.issues }, { status: 400 });
    }
    console.error("Update seller profile error:", error);
    return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 });
  }
}
