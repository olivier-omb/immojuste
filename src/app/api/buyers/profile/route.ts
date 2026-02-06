import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { calculateMatchScore } from "@/lib/matching";
import { safeNum, safeNumOptional } from "@/lib/zod-helpers";

const buyerProfileSchema = z.object({
  phone: z.string().optional(),
  consentTerms: z.boolean().optional(),
  consentPrivacy: z.boolean().optional(),
  consentMarketing: z.boolean().optional(),
  budgetMin: safeNum(0, "Budget minimum requis"),
  budgetMax: safeNum(0, "Budget maximum requis"),
  downPayment: safeNumOptional(),
  financingStatus: z.enum([
    "NOT_STARTED",
    "SIMULATED",
    "PRE_APPROVED",
    "APPROVED",
    "CASH",
  ]),
  bankName: z.string().optional(),
  timing: z.enum(["URGENT", "SHORT_TERM", "MEDIUM_TERM", "FLEXIBLE"]),
  propertyTypes: z.array(
    z.enum(["APARTMENT", "HOUSE", "STUDIO", "LOFT", "VILLA", "DUPLEX", "PENTHOUSE", "OTHER"])
  ),
  minBedrooms: safeNumOptional(),
  minSurface: safeNumOptional(),
  zones: z.array(
    z.object({
      commune: z.string(),
      postalCode: z.string().optional(),
    })
  ),
  mustHave: z.array(z.string()).optional(),
  dealbreakers: z.array(z.string()).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { phone: true, consentTerms: true, consentPrivacy: true, consentMarketing: true },
    });

    const profile = await prisma.buyerProfile.findUnique({
      where: { userId: session.user.id },
      include: { zones: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profil non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ ...profile, phone: user?.phone, consentTerms: user?.consentTerms, consentPrivacy: user?.consentPrivacy, consentMarketing: user?.consentMarketing });
  } catch (error) {
    console.error("Get buyer profile error:", error);
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

    const body = await req.json();
    const data = buyerProfileSchema.parse(body);

    // Check user is a buyer
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "BUYER") {
      return NextResponse.json(
        { error: "Accès réservé aux acheteurs" },
        { status: 403 }
      );
    }

    // Calculate qualification score
    let qualificationScore = 0;
    const badges: string[] = [];

    // Budget defined = 20 points
    if (data.budgetMax > 0) {
      qualificationScore += 20;
      badges.push("BUDGET_DEFINED");
    }

    // Zones defined = 20 points
    if (data.zones.length > 0) {
      qualificationScore += 20;
      badges.push("ZONES_DEFINED");
    }

    // Property types defined = 15 points
    if (data.propertyTypes.length > 0) {
      qualificationScore += 15;
      badges.push("CRITERIA_DEFINED");
    }

    // Financing status advanced = up to 45 points
    switch (data.financingStatus) {
      case "SIMULATED":
        qualificationScore += 15;
        badges.push("FINANCING_SIMULATED");
        break;
      case "PRE_APPROVED":
        qualificationScore += 30;
        badges.push("FINANCING_PRE_APPROVED");
        break;
      case "APPROVED":
        qualificationScore += 40;
        badges.push("FINANCING_APPROVED");
        break;
      case "CASH":
        qualificationScore += 45;
        badges.push("CASH_BUYER");
        break;
    }

    // Check if profile is complete
    const isComplete =
      data.budgetMax > 0 &&
      data.zones.length > 0 &&
      data.propertyTypes.length > 0 &&
      data.financingStatus !== "NOT_STARTED";

    // Update user fields (phone, consents)
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.consentTerms !== undefined && { consentTerms: data.consentTerms }),
        ...(data.consentPrivacy !== undefined && { consentPrivacy: data.consentPrivacy }),
        ...(data.consentMarketing !== undefined && { consentMarketing: data.consentMarketing }),
      },
    });

    // Update profile with transaction
    const profile = await prisma.$transaction(async (tx) => {
      // Delete existing zones
      await tx.buyerZone.deleteMany({
        where: {
          buyerProfile: { userId: session.user.id },
        },
      });

      // Update profile
      const updatedProfile = await tx.buyerProfile.update({
        where: { userId: session.user.id },
        data: {
          budgetMin: data.budgetMin,
          budgetMax: data.budgetMax,
          downPayment: data.downPayment,
          financingStatus: data.financingStatus,
          bankName: data.bankName,
          timing: data.timing,
          propertyTypes: data.propertyTypes,
          minBedrooms: data.minBedrooms,
          minSurface: data.minSurface,
          mustHave: data.mustHave || [],
          dealbreakers: data.dealbreakers || [],
          qualificationScore,
          badges,
          isComplete,
          updatedAt: new Date(),
          zones: {
            create: data.zones.map((zone) => ({
              commune: zone.commune,
              postalCode: zone.postalCode || getPostalCode(zone.commune),
            })),
          },
        },
        include: { zones: true },
      });

      return updatedProfile;
    });

    // Calculate matches with all active properties if profile is complete
    if (isComplete) {
      await calculateMatchesForBuyer(profile.id);
    }

    return NextResponse.json({
      message: "Profil mis à jour avec succès",
      profile,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Update buyer profile error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// Brussels postal codes mapping
function getPostalCode(commune: string): string {
  const postalCodes: Record<string, string> = {
    "Anderlecht": "1070",
    "Auderghem": "1160",
    "Berchem-Sainte-Agathe": "1082",
    "Bruxelles-Ville": "1000",
    "Etterbeek": "1040",
    "Evere": "1140",
    "Forest": "1190",
    "Ganshoren": "1083",
    "Ixelles": "1050",
    "Jette": "1090",
    "Koekelberg": "1081",
    "Molenbeek-Saint-Jean": "1080",
    "Saint-Gilles": "1060",
    "Saint-Josse-ten-Noode": "1210",
    "Schaerbeek": "1030",
    "Uccle": "1180",
    "Watermael-Boitsfort": "1170",
    "Woluwe-Saint-Lambert": "1200",
    "Woluwe-Saint-Pierre": "1150",
  };
  return postalCodes[commune] || "1000";
}

async function calculateMatchesForBuyer(buyerProfileId: string) {
  const buyerProfile = await prisma.buyerProfile.findUnique({
    where: { id: buyerProfileId },
    include: { zones: true },
  });

  if (!buyerProfile) return;

  // Get all active properties
  const properties = await prisma.property.findMany({
    where: { isActive: true },
  });

  // Calculate and save matches
  for (const property of properties) {
    const result = calculateMatchScore(buyerProfile, property);

    if (result.isCompatible) {
      await prisma.match.upsert({
        where: {
          buyerProfileId_propertyId: {
            buyerProfileId: buyerProfile.id,
            propertyId: property.id,
          },
        },
        create: {
          buyerProfileId: buyerProfile.id,
          propertyId: property.id,
          compatibilityScore: result.score,
          compatibilityGrade: result.grade,
        },
        update: {
          compatibilityScore: result.score,
          compatibilityGrade: result.grade,
          updatedAt: new Date(),
        },
      });
    } else {
      // Remove non-compatible match if it exists and not unlocked
      await prisma.match.deleteMany({
        where: {
          buyerProfileId: buyerProfile.id,
          propertyId: property.id,
          sellerUnlocked: false,
        },
      });
    }
  }
}
