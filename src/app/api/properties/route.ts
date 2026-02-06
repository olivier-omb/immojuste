import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { calculateMatchScore } from "@/lib/matching";
import { safeNum } from "@/lib/zod-helpers";

const propertySchema = z.object({
  commune: z.string().min(1, "Commune requise"),
  postalCode: z.string().min(4, "Code postal requis"),
  address: z.string().optional(),
  propertyType: z.enum([
    "APARTMENT",
    "HOUSE",
    "STUDIO",
    "LOFT",
    "VILLA",
    "DUPLEX",
    "PENTHOUSE",
    "OTHER",
  ]),
  bedrooms: safeNum(0, "Nombre de chambres invalide"),
  bathrooms: safeNum(0, "Nombre de salles de bain invalide"),
  surface: safeNum(1, "Surface requise"),
  condition: z.enum(["NEW", "EXCELLENT", "GOOD", "TO_REFRESH", "TO_RENOVATE"]),
  askingPrice: safeNum(1, "Prix demandé requis"),
  timing: z.enum(["URGENT", "SHORT_TERM", "MEDIUM_TERM", "FLEXIBLE"]),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  constraints: z.array(z.string()).optional(),
  acceptsAgents: z.boolean().optional(),
  visitAvailability: z.string().optional(),
  immwebLink: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        properties: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!sellerProfile) {
      return NextResponse.json({ error: "Profil vendeur non trouvé" }, { status: 404 });
    }

    return NextResponse.json(sellerProfile.properties);
  } catch (error) {
    console.error("Get properties error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const data = propertySchema.parse(body);

    // Check user is a seller
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

    // Get or create seller profile
    let sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!sellerProfile) {
      sellerProfile = await prisma.sellerProfile.create({
        data: { userId: session.user.id },
      });
    }

    // Update seller profile fields if provided
    if (data.visitAvailability !== undefined || data.immwebLink !== undefined) {
      await prisma.sellerProfile.update({
        where: { id: sellerProfile.id },
        data: {
          ...(data.visitAvailability !== undefined && { visitAvailability: data.visitAvailability }),
          ...(data.immwebLink !== undefined && { immwebLink: data.immwebLink }),
        },
      });
    }

    // Create property
    const property = await prisma.property.create({
      data: {
        sellerProfileId: sellerProfile.id,
        commune: data.commune,
        postalCode: data.postalCode,
        address: data.address,
        propertyType: data.propertyType,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        surface: data.surface,
        condition: data.condition,
        askingPrice: data.askingPrice,
        timing: data.timing,
        features: data.features || [],
        constraints: data.constraints || [],
        acceptsAgents: data.acceptsAgents ?? true,
      },
    });

    // Calculate matches with all active buyers
    await calculateAndSaveMatches(property.id);

    return NextResponse.json({
      message: "Bien créé avec succès",
      property,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Create property error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

async function calculateAndSaveMatches(propertyId: string) {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) return;

  // Get all active and complete buyer profiles
  const buyers = await prisma.buyerProfile.findMany({
    where: {
      isActive: true,
      isComplete: true,
    },
    include: {
      zones: true,
    },
  });

  // Calculate and save matches
  for (const buyer of buyers) {
    const result = calculateMatchScore(buyer, property);

    if (result.isCompatible) {
      await prisma.match.upsert({
        where: {
          buyerProfileId_propertyId: {
            buyerProfileId: buyer.id,
            propertyId: property.id,
          },
        },
        create: {
          buyerProfileId: buyer.id,
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
    }
  }
}
