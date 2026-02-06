import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { sendPaymentConfirmationEmail, sendContactUnlockedEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    console.error("No stripe signature found");
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCancelled(subscription);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Payment succeeded:", paymentIntent.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(paymentIntent);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata;

  if (!metadata?.userId || !metadata?.type) {
    console.error("Missing metadata in checkout session");
    return;
  }

  if (metadata.type === "seller_unlock") {
    const matchId = metadata.matchId;

    if (!matchId) {
      console.error("Missing matchId in seller_unlock metadata");
      return;
    }

    // Record payment
    const payment = await prisma.payment.create({
      data: {
        userId: metadata.userId,
        stripePaymentId: (session.payment_intent as string) || session.id,
        stripeCustomerId: (session.customer as string) || undefined,
        amount: session.amount_total || 0,
        currency: session.currency || "EUR",
        type: "SELLER_SINGLE_UNLOCK",
        status: "COMPLETED",
        metadata: { matchId },
      },
    });

    // Unlock the match and link payment
    const match = await prisma.match.update({
      where: { id: matchId },
      data: {
        sellerUnlocked: true,
        sellerUnlockedAt: new Date(),
        status: "UNLOCKED",
        paymentId: payment.id,
      },
      include: {
        property: true,
        buyerProfile: {
          include: {
            user: {
              select: { id: true, firstName: true, email: true },
            },
          },
        },
      },
    });

    // Notify buyer
    await prisma.notification.create({
      data: {
        userId: match.buyerProfile.user.id,
        type: "MATCH_UNLOCKED",
        title: "Un espace d'échange a été activé !",
        message: `Un vendeur a activé un espace d'échange privé pour son bien à ${match.property.commune}.`,
        data: { matchId, propertyCommune: match.property.commune },
      },
    });

    // Notify seller
    await prisma.notification.create({
      data: {
        userId: metadata.userId,
        type: "PAYMENT_SUCCESS",
        title: "Espace d'échange activé",
        message: `Votre espace d'échange privé a été activé avec succès.`,
        data: { matchId, paymentId: payment.id },
      },
    });

    // Send emails
    const seller = await prisma.user.findUnique({
      where: { id: metadata.userId },
      select: { email: true, firstName: true },
    });

    if (seller?.email) {
      sendPaymentConfirmationEmail({
        recipientName: seller.firstName || "Client",
        recipientEmail: seller.email,
        amount: (session.amount_total || 0) / 100,
      }).catch((err) => console.error("Failed to send payment email:", err));
    }

    if (match.buyerProfile.user.email) {
      sendContactUnlockedEmail({
        recipientName: match.buyerProfile.user.firstName || "Acheteur",
        recipientEmail: match.buyerProfile.user.email,
        propertyCommune: match.property.commune,
        sellerName: seller?.firstName || "Un vendeur",
      }).catch((err) => console.error("Failed to send unlock email:", err));
    }

    console.log(`Seller unlock completed: match ${matchId} for user ${metadata.userId}`);
  } else if (metadata.type === "agent_subscription") {
    const subscriptionId = metadata.subscriptionId?.toUpperCase();
    let tier: "ESSENTIAL" | "PRO" | "PREMIUM" = "ESSENTIAL";

    if (subscriptionId === "PRO") tier = "PRO";
    else if (subscriptionId === "PREMIUM") tier = "PREMIUM";

    const leads = parseInt(metadata.leads || "10");

    await prisma.agentProfile.update({
      where: { userId: metadata.userId },
      data: {
        subscriptionTier: tier,
        stripeSubscriptionId: (session.subscription as string) || undefined,
        subscriptionEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        leadsThisMonth: 0,
        monthlyCapacity: leads,
      },
    });

    await prisma.payment.create({
      data: {
        userId: metadata.userId,
        stripePaymentId: (session.subscription as string) || session.id,
        stripeCustomerId: (session.customer as string) || undefined,
        amount: session.amount_total || 0,
        currency: session.currency || "EUR",
        type: "AGENT_SUBSCRIPTION",
        status: "COMPLETED",
        metadata: { subscriptionId, tier, leads },
      },
    });

    await prisma.notification.create({
      data: {
        userId: metadata.userId,
        type: "PAYMENT_SUCCESS",
        title: "Abonnement activé",
        message: `Votre abonnement ${tier} a été activé avec succès.`,
        data: { tier, leads },
      },
    });

    console.log(`Agent subscription started: ${tier} for user ${metadata.userId}`);
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const payment = await prisma.payment.findFirst({
    where: { stripeCustomerId: customerId },
    select: { userId: true },
  });

  if (!payment) {
    console.error("No user found for customer:", customerId);
    return;
  }

  const currentPeriodEnd = (subscription as unknown as { current_period_end?: number }).current_period_end;

  await prisma.agentProfile.update({
    where: { userId: payment.userId },
    data: {
      subscriptionEndsAt: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  console.log(`Subscription updated for user ${payment.userId}`);
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const payment = await prisma.payment.findFirst({
    where: { stripeCustomerId: customerId },
    select: { userId: true },
  });

  if (!payment) {
    console.error("No user found for customer:", customerId);
    return;
  }

  await prisma.agentProfile.update({
    where: { userId: payment.userId },
    data: {
      subscriptionTier: "NONE",
      stripeSubscriptionId: null,
      subscriptionEndsAt: null,
    },
  });

  await prisma.notification.create({
    data: {
      userId: payment.userId,
      type: "SUBSCRIPTION_EXPIRING",
      title: "Abonnement annulé",
      message: "Votre abonnement a été annulé. Vous pouvez vous réabonner à tout moment.",
    },
  });

  console.log(`Subscription cancelled for user ${payment.userId}`);
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const customerId = paymentIntent.customer as string;

  if (!customerId) return;

  const payment = await prisma.payment.findFirst({
    where: { stripeCustomerId: customerId },
    select: { userId: true },
  });

  if (!payment) return;

  await prisma.notification.create({
    data: {
      userId: payment.userId,
      type: "PAYMENT_SUCCESS",
      title: "Échec du paiement",
      message: "Votre paiement a échoué. Veuillez réessayer ou utiliser un autre moyen de paiement.",
    },
  });

  console.log(`Payment failed for user ${payment.userId}`);
}
