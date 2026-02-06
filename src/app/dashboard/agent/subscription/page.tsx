"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  CheckCircle,
  Zap,
  Crown,
  Users,
  MapPin,
  Clock,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Subscription {
  id: string;
  plan: "STARTER" | "PRO" | "PREMIUM";
  status: "ACTIVE" | "CANCELLED" | "EXPIRED" | "TRIAL";
  currentPeriodEnd: string;
  leadsThisMonth: number;
  leadsLimit: number;
}

const plans = [
  {
    id: "STARTER",
    name: "Starter",
    price: 149,
    icon: Zap,
    color: "text-blue-600 bg-blue-50",
    features: [
      "10 leads / mois",
      "3 zones couvertes",
      "Profils acheteurs détaillés",
      "Support email",
    ],
    leadsLimit: 10,
  },
  {
    id: "PRO",
    name: "Pro",
    price: 299,
    icon: Users,
    color: "text-brand-primary bg-brand-primary/10",
    popular: true,
    features: [
      "30 leads / mois",
      "10 zones couvertes",
      "Profils acheteurs détaillés",
      "Notifications en temps réel",
      "Support prioritaire",
      "Export des données",
    ],
    leadsLimit: 30,
  },
  {
    id: "PREMIUM",
    name: "Premium",
    price: 499,
    icon: Crown,
    color: "text-amber-600 bg-amber-50",
    features: [
      "Leads illimités",
      "Toutes les zones",
      "Profils acheteurs détaillés",
      "Notifications en temps réel",
      "Support dédié",
      "Export des données",
      "Accès API",
      "Analytics avancés",
    ],
    leadsLimit: -1,
  },
];

export default function AgentSubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSubscription() {
      try {
        const res = await fetch("/api/agents/subscription");
        if (res.ok) {
          const data = await res.json();
          setSubscription(data);
        }
      } catch (err) {
        console.error("Failed to load subscription:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSubscription();
  }, []);

  const handleSubscribe = async (planId: string) => {
    setIsProcessing(true);
    setError(null);

    try {
      const res = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "agent_subscription",
          planId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la création du paiement");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du paiement");
      setIsProcessing(false);
    }
  };

  const handleManageBilling = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/payments/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Failed to open billing portal:", err);
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-brand-dark">
          Mon abonnement
        </h1>
        <p className="text-brand-gray mt-1">
          Gérez votre plan et votre facturation
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Current plan */}
      {subscription && (
        <Card className="border-brand-primary/30 bg-gradient-to-r from-brand-primary/5 to-transparent">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-brand-dark">
                    Plan {subscription.plan}
                  </h2>
                  <Badge
                    variant={subscription.status === "ACTIVE" ? "success" : "default"}
                  >
                    {subscription.status === "ACTIVE"
                      ? "Actif"
                      : subscription.status === "TRIAL"
                      ? "Essai"
                      : subscription.status === "CANCELLED"
                      ? "Annulé"
                      : "Expiré"}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-brand-gray">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {subscription.leadsThisMonth} / {subscription.leadsLimit === -1 ? "illimité" : subscription.leadsLimit} leads ce mois
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Renouvellement le{" "}
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString("fr-BE")}
                  </span>
                </div>
              </div>
              <Button variant="outline" onClick={handleManageBilling} disabled={isProcessing}>
                <CreditCard className="h-4 w-4 mr-2" />
                Gérer la facturation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = subscription?.plan === plan.id;

          return (
            <Card
              key={plan.id}
              className={cn(
                "relative transition-all hover:shadow-card-hover",
                plan.popular && "ring-2 ring-brand-primary",
                isCurrent && "ring-2 ring-brand-secondary"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="default" className="bg-brand-primary text-white">
                    Le plus populaire
                  </Badge>
                </div>
              )}
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3", plan.color)}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-brand-dark">{plan.price}€</span>
                    <span className="text-brand-gray text-sm"> /mois</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-brand-secondary flex-shrink-0 mt-0.5" />
                      <span className="text-brand-gray">{feature}</span>
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <Button variant="outline" className="w-full" disabled>
                    Plan actuel
                  </Button>
                ) : (
                  <Button
                    className={cn("w-full", plan.popular && "bg-brand-primary")}
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <ArrowRight className="h-4 w-4 mr-2" />
                    )}
                    {subscription ? "Changer de plan" : "Commencer"}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Questions fréquentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium text-brand-dark">Puis-je changer de plan à tout moment ?</p>
            <p className="text-sm text-brand-gray mt-1">
              Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Le changement prend effet immédiatement
              et la facturation est ajustée au prorata.
            </p>
          </div>
          <div>
            <p className="font-medium text-brand-dark">Que se passe-t-il si j'atteins ma limite de leads ?</p>
            <p className="text-sm text-brand-gray mt-1">
              Vous recevrez une notification. Vous pouvez upgrader votre plan pour obtenir plus de leads
              ou attendre le renouvellement mensuel.
            </p>
          </div>
          <div>
            <p className="font-medium text-brand-dark">Comment annuler mon abonnement ?</p>
            <p className="text-sm text-brand-gray mt-1">
              Cliquez sur "Gérer la facturation" pour accéder au portail Stripe où vous pourrez
              annuler votre abonnement. Vous conserverez l'accès jusqu'à la fin de la période en cours.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
