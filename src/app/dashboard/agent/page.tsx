"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  TrendingUp,
  MapPin,
  Euro,
  Clock,
  CreditCard,
  Star,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Lead {
  id: string;
  score: number;
  grade: string;
  createdAt: string;
  buyer: {
    id: string;
    name: string;
    budgetMin: number;
    budgetMax: number;
    timing: string;
    financingStatus: string;
    propertyTypes: string[];
    zones: string[];
    qualificationScore: number;
  };
  property: {
    id: string;
    commune: string;
    postalCode: string;
    propertyType: string;
    bedrooms: number;
    surface: number;
    askingPrice: number;
    sellerName: string;
  };
}

interface AgentProfile {
  id: string;
  agencyName: string;
  subscriptionTier: string;
  subscriptionEndsAt: string | null;
  leadsThisMonth: number;
  totalLeads: number;
  monthlyCapacity: number;
  zones: { commune: string }[];
}

const timingLabels: Record<string, string> = {
  URGENT: "0-3 mois",
  SHORT_TERM: "3-6 mois",
  MEDIUM_TERM: "6-12 mois",
  FLEXIBLE: "12+ mois",
};

const financingLabels: Record<string, string> = {
  NOT_STARTED: "Non commencé",
  SIMULATED: "Simulation faite",
  PRE_APPROVED: "Pré-approuvé",
  APPROVED: "Crédit approuvé",
  CASH: "Comptant",
};

const propertyTypeLabels: Record<string, string> = {
  APARTMENT: "Appartement",
  HOUSE: "Maison",
  STUDIO: "Studio",
  DUPLEX: "Duplex",
  VILLA: "Villa",
  LOFT: "Loft",
  PENTHOUSE: "Penthouse",
  OTHER: "Autre",
};

export default function AgentDashboard() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<AgentProfile | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<{
    leadsUsed: number;
    leadLimit: number;
    leadsRemaining: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [profileRes, leadsRes] = await Promise.all([
          fetch("/api/agents/profile"),
          fetch("/api/agents/leads"),
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
        }

        if (leadsRes.ok) {
          const leadsData = await leadsRes.json();
          setLeads(leadsData.leads || []);
          setStats(leadsData.stats);
        } else if (leadsRes.status === 403) {
          const data = await leadsRes.json();
          setError(data.error);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Impossible de charger les données");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-BE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  // No subscription
  if (!profile || profile.subscriptionTier === "NONE") {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-dark">
            Bienvenue {session?.user?.name?.split(" ")[0] || ""}
          </h1>
          <p className="text-brand-gray mt-1">
            Accédez aux leads qualifiés pour développer votre activité
          </p>
        </div>

        <Card className="border-warning bg-warning/5">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-warning mb-4" />
            <h3 className="text-lg font-semibold text-brand-dark mb-2">
              Abonnement requis
            </h3>
            <p className="text-brand-gray text-center mb-6 max-w-md">
              Pour accéder aux leads qualifiés et développer votre portefeuille
              clients, choisissez un abonnement adapté à vos besoins.
            </p>
            <Link href="/agent">
              <Button size="lg">
                Voir les offres
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-dark">
            Bonjour {session?.user?.name?.split(" ")[0] || ""}
          </h1>
          <p className="text-brand-gray mt-1">
            {profile.agencyName} • Abonnement{" "}
            <span className="font-semibold text-brand-primary">
              {profile.subscriptionTier}
            </span>
          </p>
        </div>
        <Link href="/agent">
          <Button variant="outline">Gérer mon abonnement</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-brand-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-dark">
                  {leads.length}
                </p>
                <p className="text-xs text-brand-gray">Leads disponibles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-secondary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-brand-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-dark">
                  {stats?.leadsUsed || 0}
                </p>
                <p className="text-xs text-brand-gray">Leads ce mois</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-dark">
                  {stats?.leadsRemaining || 0}
                </p>
                <p className="text-xs text-brand-gray">Leads restants</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-dark">
                  {profile.zones?.length || 0}
                </p>
                <p className="text-xs text-brand-gray">Zones couvertes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead usage */}
      {stats && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-brand-dark">
                Utilisation des leads
              </span>
              <span className="text-sm text-brand-gray">
                {stats.leadsUsed} / {stats.leadLimit} ce mois
              </span>
            </div>
            <Progress
              value={(stats.leadsUsed / stats.leadLimit) * 100}
              size="md"
            />
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Leads */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Leads qualifiés
          </CardTitle>
        </CardHeader>
        <CardContent>
          {leads.length > 0 ? (
            <div className="space-y-4">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-4 bg-brand-background rounded-xl"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Buyer info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant={
                            lead.grade === "A"
                              ? "grade_a"
                              : lead.grade === "B"
                              ? "grade_b"
                              : "grade_c"
                          }
                        >
                          {lead.score}% match
                        </Badge>
                        <span className="text-sm font-medium text-brand-dark">
                          {lead.buyer.name}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Euro className="h-3 w-3 text-brand-gray" />
                          <span>
                            {formatPrice(lead.buyer.budgetMin)} -{" "}
                            {formatPrice(lead.buyer.budgetMax)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-brand-gray" />
                          <span>{timingLabels[lead.buyer.timing]}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-3 w-3 text-brand-gray" />
                          <span
                            className={cn(
                              ["APPROVED", "CASH", "PRE_APPROVED"].includes(
                                lead.buyer.financingStatus
                              ) && "text-brand-secondary font-medium"
                            )}
                          >
                            {financingLabels[lead.buyer.financingStatus]}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-brand-gray" />
                          <span className="truncate">
                            {lead.buyer.zones.slice(0, 2).join(", ")}
                            {lead.buyer.zones.length > 2 && "..."}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Property info */}
                    <div className="lg:w-64 p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Building className="h-4 w-4 text-brand-gray" />
                        <span className="font-medium text-brand-dark text-sm">
                          {propertyTypeLabels[lead.property.propertyType]}{" "}
                          {lead.property.bedrooms}ch
                        </span>
                      </div>
                      <p className="text-sm text-brand-gray">
                        {lead.property.commune} • {formatPrice(lead.property.askingPrice)}
                      </p>
                      <p className="text-xs text-brand-gray mt-1">
                        Vendeur: {lead.property.sellerName}
                      </p>
                    </div>

                    {/* Action */}
                    <Button size="sm">
                      Contacter
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-brand-gray mx-auto mb-4" />
              <p className="text-brand-gray">
                Aucun lead disponible dans vos zones pour le moment
              </p>
              <p className="text-sm text-brand-gray mt-2">
                Élargissez vos zones de couverture pour voir plus de leads
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
