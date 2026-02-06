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

    const agentProfile = await prisma.agentProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        zones: true,
      },
    });

    if (!agentProfile) {
      return NextResponse.json(
        { error: "Profil agent non trouvé" },
        { status: 404 }
      );
    }

    // Check subscription
    if (agentProfile.subscriptionTier === "NONE") {
      return NextResponse.json(
        { error: "Abonnement requis pour accéder aux leads" },
        { status: 403 }
      );
    }

    // Check if subscription is expired
    if (
      agentProfile.subscriptionEndsAt &&
      new Date(agentProfile.subscriptionEndsAt) < new Date()
    ) {
      return NextResponse.json(
        { error: "Votre abonnement a expiré" },
        { status: 403 }
      );
    }

    // Get agent's zones
    const agentZones = agentProfile.zones.map((z) => z.commune.toLowerCase());

    // Get leads based on tier limits
    const leadLimit = getLeadLimit(agentProfile.subscriptionTier);
    const leadsUsed = agentProfile.leadsThisMonth;

    // Get matches in agent's zones where property accepts agents
    const leads = await prisma.match.findMany({
      where: {
        property: {
          acceptsAgents: true,
          isActive: true,
          commune: {
            in: agentProfile.zones.map((z) => z.commune),
            mode: "insensitive",
          },
        },
        compatibilityScore: {
          gte: 60, // Only good matches
        },
      },
      include: {
        buyerProfile: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            zones: true,
          },
        },
        property: {
          include: {
            sellerProfile: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        compatibilityScore: "desc",
      },
      take: leadLimit,
    });

    // Format leads for agent view
    const formattedLeads = leads.map((lead) => ({
      id: lead.id,
      score: lead.compatibilityScore,
      grade: lead.compatibilityGrade,
      createdAt: lead.createdAt,
      buyer: {
        id: lead.buyerProfile.id,
        name: `${lead.buyerProfile.user.firstName || ""} ${lead.buyerProfile.user.lastName?.[0] || ""}.`,
        budgetMin: lead.buyerProfile.budgetMin,
        budgetMax: lead.buyerProfile.budgetMax,
        timing: lead.buyerProfile.timing,
        financingStatus: lead.buyerProfile.financingStatus,
        propertyTypes: lead.buyerProfile.propertyTypes,
        zones: lead.buyerProfile.zones.map((z) => z.commune),
        qualificationScore: lead.buyerProfile.qualificationScore,
      },
      property: {
        id: lead.property.id,
        commune: lead.property.commune,
        postalCode: lead.property.postalCode,
        propertyType: lead.property.propertyType,
        bedrooms: lead.property.bedrooms,
        surface: lead.property.surface,
        askingPrice: lead.property.askingPrice,
        sellerName: `${lead.property.sellerProfile.user.firstName || ""} ${lead.property.sellerProfile.user.lastName?.[0] || ""}.`,
      },
    }));

    return NextResponse.json({
      leads: formattedLeads,
      stats: {
        leadsUsed,
        leadLimit,
        leadsRemaining: Math.max(0, leadLimit - leadsUsed),
        subscriptionTier: agentProfile.subscriptionTier,
        subscriptionEndsAt: agentProfile.subscriptionEndsAt,
      },
    });
  } catch (error) {
    console.error("Get agent leads error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

function getLeadLimit(tier: string): number {
  switch (tier) {
    case "ESSENTIAL":
      return 10;
    case "PRO":
      return 30;
    case "PREMIUM":
      return 100;
    default:
      return 0;
  }
}
