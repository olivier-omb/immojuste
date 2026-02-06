import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { calculateMatchScore } from "@/lib/matching";
import { safeNumOptional } from "@/lib/zod-helpers";

const propertyUpdateSchema = z.object({
  commune: z.string().min(1, "Commune requise").optional(),
  postalCode: z.string().min(4, "Code postal requis").optional(),
  address: z.string().optional(),
  propertyType: z
    .enum([
      "APARTMENT",
      "HOUSE",
      "STUDIO",
      "LOFT",
      "VILLA",
      "DUPLEX",
      "PENTHOUSE",
      "OTHER",
    ])
    .optional(),
  bedrooms: safeNumOptional(),
  bathrooms: safeNumOptional(),
  surface: safeNumOptional(),
  condition: z
    .enum(["NEW", "EXCELLENT", "GOOD", "TO_REFRESH", "TO_RENOVATE"])
    .optional(),
  askingPrice: safeNumOptional(),
  timing: z.enum(["URGENT", "SHORT_TERM", "MEDIUM_TERM", "FLEXIBLE"]).optional(),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  constraints: z.array(z.string()).optional(),
  acceptsAgents: z.boolean().optional(),
  isActive: z.boolean().optional(),
  visitAvailability: z.string().optional(),
  immwebLink: z.string().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        sellerProfile: {
          select: { userId: true },
        },
        matches: {
          include: {
            buyerProfile: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                  },
                },
                zones: true,
              },
            },
          },
          orderBy: { compatibilityScore: "desc" },
        },
      },
    });

    if (!property) {
      return NextResponse.json({ error: "Bien non trouvé" }, { status: 404 });
    }

    // Check ownership
    if (property.sellerProfile.userId !== session.user.id) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error("Get property error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const data = propertyUpdateSchema.parse(body);

    // Check ownership
    const existingProperty = await prisma.property.findUnique({
      where: { id },
      include: {
        sellerProfile: {
          select: { userId: true },
        },
      },
    });

    if (!existingProperty) {
      return NextResponse.json({ error: "Bien non trouvé" }, { status: 404 });
    }

    if (existingProperty.sellerProfile.userId !== session.user.id) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    // Update seller profile fields if provided
    if (data.visitAvailability !== undefined || data.immwebLink !== undefined) {
      await prisma.sellerProfile.update({
        where: { id: existingProperty.sellerProfileId },
        data: {
          ...(data.visitAvailability !== undefined && { visitAvailability: data.visitAvailability }),
          ...(data.immwebLink !== undefined && { immwebLink: data.immwebLink }),
        },
      });
    }

    // Update property (exclude seller profile fields)
    const { visitAvailability, immwebLink, ...propertyData } = data;
    const property = await prisma.property.update({
      where: { id },
      data: {
        ...propertyData,
        updatedAt: new Date(),
      },
    });

    // Recalculate matches if key fields changed
    const keyFieldsChanged =
      data.commune !== undefined ||
      data.askingPrice !== undefined ||
      data.timing !== undefined ||
      data.bedrooms !== undefined ||
      data.surface !== undefined ||
      data.propertyType !== undefined;

    if (keyFieldsChanged) {
      await recalculateMatches(property.id);
    }

    return NextResponse.json({
      message: "Bien mis à jour avec succès",
      property,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Update property error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Check ownership
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        sellerProfile: {
          select: { userId: true },
        },
      },
    });

    if (!property) {
      return NextResponse.json({ error: "Bien non trouvé" }, { status: 404 });
    }

    if (property.sellerProfile.userId !== session.user.id) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    // Delete property (cascades to matches)
    await prisma.property.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Bien supprimé avec succès",
    });
  } catch (error) {
    console.error("Delete property error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

async function recalculateMatches(propertyId: string) {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) return;

  // Get all active buyer profiles
  const buyers = await prisma.buyerProfile.findMany({
    where: {
      isActive: true,
      isComplete: true,
    },
    include: {
      zones: true,
    },
  });

  // Recalculate matches
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
    } else {
      // Remove non-compatible match if it exists
      await prisma.match.deleteMany({
        where: {
          buyerProfileId: buyer.id,
          propertyId: property.id,
          sellerUnlocked: false, // Only delete if not yet unlocked
        },
      });
    }
  }
}
