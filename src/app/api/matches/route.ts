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

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    if (user.role === "BUYER") {
      return getBuyerMatches(session.user.id);
    } else if (user.role === "SELLER") {
      return getSellerMatches(session.user.id);
    } else {
      return NextResponse.json(
        { error: "Rôle non supporté pour les matches" },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("Get matches error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

async function getBuyerMatches(userId: string) {
  const buyerProfile = await prisma.buyerProfile.findUnique({
    where: { userId },
  });

  if (!buyerProfile) {
    return NextResponse.json({ error: "Profil acheteur non trouvé" }, { status: 404 });
  }

  const matches = await prisma.match.findMany({
    where: {
      buyerProfileId: buyerProfile.id,
    },
    include: {
      property: {
        include: {
          sellerProfile: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { compatibilityScore: "desc" },
  });

  // For buyers: hide seller contact info unless the seller has unlocked them
  const sanitizedMatches = matches.map((match) => ({
    id: match.id,
    compatibilityScore: match.compatibilityScore,
    compatibilityGrade: match.compatibilityGrade,
    status: match.status,
    sellerUnlocked: match.sellerUnlocked,
    createdAt: match.createdAt,
    property: {
      id: match.property.id,
      commune: match.property.commune,
      postalCode: match.property.postalCode,
      propertyType: match.property.propertyType,
      bedrooms: match.property.bedrooms,
      bathrooms: match.property.bathrooms,
      surface: match.property.surface,
      condition: match.property.condition,
      askingPrice: match.property.askingPrice,
      timing: match.property.timing,
      features: match.property.features,
      // Only show seller info if they've unlocked this buyer
      seller: match.sellerUnlocked
        ? {
            firstName: match.property.sellerProfile.user.firstName,
            lastName: match.property.sellerProfile.user.lastName,
            email: match.property.sellerProfile.user.email,
          }
        : null,
    },
  }));

  return NextResponse.json(sanitizedMatches);
}

async function getSellerMatches(userId: string) {
  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { userId },
    include: {
      properties: {
        select: { id: true },
      },
    },
  });

  if (!sellerProfile) {
    return NextResponse.json({ error: "Profil vendeur non trouvé" }, { status: 404 });
  }

  const propertyIds = sellerProfile.properties.map((p) => p.id);

  const matches = await prisma.match.findMany({
    where: {
      propertyId: { in: propertyIds },
    },
    include: {
      buyerProfile: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          zones: true,
        },
      },
      property: {
        select: {
          id: true,
          commune: true,
          askingPrice: true,
        },
      },
    },
    orderBy: { compatibilityScore: "desc" },
  });

  // For sellers: hide buyer contact info unless they've paid to unlock
  const sanitizedMatches = matches.map((match) => ({
    id: match.id,
    compatibilityScore: match.compatibilityScore,
    compatibilityGrade: match.compatibilityGrade,
    status: match.status,
    sellerUnlocked: match.sellerUnlocked,
    sellerUnlockedAt: match.sellerUnlockedAt,
    buyerConfirmed: match.buyerConfirmed,
    createdAt: match.createdAt,
    property: match.property,
    buyer: {
      id: match.buyerProfile.id,
      budgetMin: match.buyerProfile.budgetMin,
      budgetMax: match.buyerProfile.budgetMax,
      timing: match.buyerProfile.timing,
      financingStatus: match.buyerProfile.financingStatus,
      propertyTypes: match.buyerProfile.propertyTypes,
      minBedrooms: match.buyerProfile.minBedrooms,
      minSurface: match.buyerProfile.minSurface,
      mustHave: match.buyerProfile.mustHave,
      qualificationScore: match.buyerProfile.qualificationScore,
      badges: match.buyerProfile.badges,
      zones: match.buyerProfile.zones.map((z) => z.commune),
      // Only show contact info if unlocked
      contact: match.sellerUnlocked
        ? {
            firstName: match.buyerProfile.user.firstName,
            lastName: match.buyerProfile.user.lastName,
            email: match.buyerProfile.user.email,
            phone: match.buyerProfile.user.phone,
          }
        : null,
    },
  }));

  return NextResponse.json(sanitizedMatches);
}
