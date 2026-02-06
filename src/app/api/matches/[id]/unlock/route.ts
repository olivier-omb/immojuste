import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: matchId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Get the match and verify ownership
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        property: {
          include: {
            sellerProfile: {
              select: { userId: true },
            },
          },
        },
        buyerProfile: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!match) {
      return NextResponse.json({ error: "Match non trouvé" }, { status: 404 });
    }

    // Verify the seller owns this property
    if (match.property.sellerProfile.userId !== session.user.id) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    // Check if already unlocked
    if (match.sellerUnlocked) {
      return NextResponse.json({
        message: "Cet espace d'échange est déjà activé",
        contact: {
          firstName: match.buyerProfile.user.firstName,
          lastName: match.buyerProfile.user.lastName,
          email: match.buyerProfile.user.email,
          phone: match.buyerProfile.user.phone,
        },
      });
    }

    // Redirect to payment — unlock is done via Stripe webhook after payment
    return NextResponse.json(
      {
        error: "Paiement requis",
        requiresPayment: true,
        matchId: matchId,
        amount: 79,
      },
      { status: 402 }
    );
  } catch (error) {
    console.error("Unlock match error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
