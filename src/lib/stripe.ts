import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("Warning: STRIPE_SECRET_KEY is not set. Stripe integration will not work.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2026-01-28.clover",
  typescript: true,
});

export const SELLER_UNLOCK_PRICE = {
  name: "Activation espace d'échange privé",
  description: "Accédez aux coordonnées d'un acheteur qualifié",
  price: 7900, // 79€ en centimes
} as const;

export const AGENT_SUBSCRIPTIONS = {
  ESSENTIAL: {
    id: "essential",
    name: "Essentiel",
    description: "10 leads/mois, 3 zones",
    price: 9900,
    leads: 10,
    zones: 3,
    priceId: process.env.STRIPE_PRICE_ESSENTIAL || "",
  },
  PRO: {
    id: "pro",
    name: "Pro",
    description: "30 leads/mois, 10 zones, CRM",
    price: 19900,
    leads: 30,
    zones: 10,
    priceId: process.env.STRIPE_PRICE_PRO || "",
  },
  PREMIUM: {
    id: "premium",
    name: "Premium",
    description: "100 leads/mois, zones illimitées, support prioritaire",
    price: 34900,
    leads: 100,
    zones: -1,
    priceId: process.env.STRIPE_PRICE_PREMIUM || "",
  },
} as const;

export type AgentSubscriptionType = keyof typeof AGENT_SUBSCRIPTIONS;
