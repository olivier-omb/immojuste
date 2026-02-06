import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const agentProfileSchema = z.object({
  agencyName: z.string().min(1, "Nom de l'agence requis"),
  ipiNumber: z.string().min(1, "Numéro IPI requis"),
  licenseNumber: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  bio: z.string().optional(),
  specialties: z.union([
    z.array(z.enum(["APARTMENT", "HOUSE", "STUDIO", "LOFT", "VILLA", "DUPLEX", "PENTHOUSE", "OTHER"])),
    z.array(z.string()),
  ]).optional(),
  zones: z.union([
    z.array(z.object({
      commune: z.string(),
      postalCode: z.string().optional(),
    })),
    z.array(z.string()),
  ]).optional(),
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

    if (user?.role !== "AGENT") {
      return NextResponse.json(
        { error: "Accès réservé aux agents" },
        { status: 403 }
      );
    }

    const profile = await prisma.agentProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        zones: true,
        _count: {
          select: { matchAccesses: true },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profil non trouvé" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Get agent profile error:", error);
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
    const data = agentProfileSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "AGENT") {
      return NextResponse.json(
        { error: "Accès réservé aux agents" },
        { status: 403 }
      );
    }

    // Update user phone if provided
    if (data.phone !== undefined) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { phone: data.phone },
      });
    }

    // Normalize zones: accept either string[] or {commune, postalCode}[]
    const normalizedZones = data.zones?.map((z) =>
      typeof z === "string" ? { commune: z, postalCode: "" } : { commune: z.commune, postalCode: z.postalCode || "" }
    );

    // Update profile with transaction
    const profile = await prisma.$transaction(async (tx) => {
      // Delete existing zones if new ones provided
      if (normalizedZones) {
        await tx.agentZone.deleteMany({
          where: {
            agentProfile: { userId: session.user.id },
          },
        });
      }

      const updatedProfile = await tx.agentProfile.update({
        where: { userId: session.user.id },
        data: {
          agencyName: data.agencyName,
          ipiNumber: data.ipiNumber,
          specialties: (data.specialties || []) as ("APARTMENT" | "HOUSE" | "STUDIO" | "LOFT" | "VILLA" | "DUPLEX" | "PENTHOUSE" | "OTHER")[],
          ...(normalizedZones && {
            zones: {
              create: normalizedZones,
            },
          }),
        },
        include: {
          zones: true,
        },
      });

      return updatedProfile;
    });

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
    console.error("Update agent profile error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
