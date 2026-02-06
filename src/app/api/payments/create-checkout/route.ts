import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { stripe, SELLER_UNLOCK_PRICE, AGENT_SUBSCRIPTIONS } from "@/lib/stripe";

const checkoutSchema = z.object({
  type: z.enum(["seller_unlock", "agent_subscription"]),
  matchId: z.string().optional(),
  planId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const data = checkoutSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    let checkoutSession;

    if (data.type === "seller_unlock") {
      if (user.role !== "SELLER") {
        return NextResponse.json(
          { error: "Accès réservé aux vendeurs" },
          { status: 403 }
        );
      }

      if (!data.matchId) {
        return NextResponse.json(
          { error: "matchId requis" },
          { status: 400 }
        );
      }

      // Verify match exists and belongs to this seller
      const match = await prisma.match.findFirst({
        where: {
          id: data.matchId,
          property: {
            sellerProfile: {
              userId: session.user.id,
            },
          },
          sellerUnlocked: false,
        },
      });

      if (!match) {
        return NextResponse.json(
          { error: "Match non trouvé ou déjà activé" },
          { status: 400 }
        );
      }

      checkoutSession = await stripe.checkout.sessions.create({
        customer_email: user.email || undefined,
        payment_method_types: ["card", "bancontact"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: SELLER_UNLOCK_PRICE.name,
                description: SELLER_UNLOCK_PRICE.description,
              },
              unit_amount: SELLER_UNLOCK_PRICE.price,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/seller/matches?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/seller/matches?payment=cancelled`,
        metadata: {
          userId: session.user.id,
          type: "seller_unlock",
          matchId: data.matchId,
        },
      });
    } else if (data.type === "agent_subscription") {
      if (user.role !== "AGENT") {
        return NextResponse.json(
          { error: "Accès réservé aux agents" },
          { status: 403 }
        );
      }

      const subKey = (data.planId || "").toUpperCase() as keyof typeof AGENT_SUBSCRIPTIONS;
      const subscription = AGENT_SUBSCRIPTIONS[subKey];

      if (!subscription) {
        return NextResponse.json(
          { error: "Abonnement non trouvé" },
          { status: 400 }
        );
      }

      checkoutSession = await stripe.checkout.sessions.create({
        customer_email: user.email || undefined,
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: `ImmoJuste Agent - ${subscription.name}`,
                description: subscription.description,
              },
              unit_amount: subscription.price,
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/agent?subscription=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/agent?subscription=cancelled`,
        metadata: {
          userId: session.user.id,
          type: "agent_subscription",
          subscriptionId: data.planId || "",
          leads: subscription.leads.toString(),
          zones: subscription.zones.toString(),
        },
      });
    } else {
      return NextResponse.json({ error: "Type non supporté" }, { status: 400 });
    }

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Create checkout error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
