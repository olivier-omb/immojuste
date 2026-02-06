"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Users,
  Eye,
  Unlock,
  Plus,
  ArrowRight,
  TrendingUp,
  Loader2,
} from "lucide-react";

interface Property {
  id: string;
  commune: string;
  postalCode: string;
  propertyType: string;
  bedrooms: number;
  surface: number;
  askingPrice: number;
  isActive: boolean;
  _count: {
    matches: number;
  };
}

interface SellerProfile {
  id: string;
  unlockedMatchesCount: number;
  properties: Property[];
}

interface Match {
  id: string;
  compatibilityScore: number;
  compatibilityGrade: string;
  sellerUnlocked: boolean;
  buyer: {
    budgetMin: number;
    budgetMax: number;
    timing: string;
    financingStatus: string;
    contact: {
      firstName: string;
      lastName: string;
    } | null;
  };
}

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

export default function SellerDashboard() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [profileRes, matchesRes] = await Promise.all([
          fetch("/api/sellers/profile"),
          fetch("/api/matches"),
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
        }

        if (matchesRes.ok) {
          const matchesData = await matchesRes.json();
          setMatches(matchesData);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
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

  const getInitials = (match: Match) => {
    if (match.sellerUnlocked && match.buyer.contact) {
      const first = match.buyer.contact.firstName?.[0] || "";
      const last = match.buyer.contact.lastName?.[0] || "";
      return `${first}${last}`.toUpperCase();
    }
    return "??";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  const hasProperty = profile && profile.properties.length > 0;
  const property = hasProperty ? profile.properties[0] : null;

  const stats = {
    compatibleBuyers: matches.length,
    activatedSpaces: profile?.unlockedMatchesCount || 0,
    views: 0,
  };

  const recentMatches = matches.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-dark">
            Bonjour {session?.user?.name?.split(" ")[0] || ""}
          </h1>
          <p className="text-brand-gray mt-1">
            Gérez votre bien et vos acheteurs potentiels
          </p>
        </div>
        {!hasProperty && (
          <Link href="/dashboard/seller/property">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter mon bien
            </Button>
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-brand-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-dark">
                  {stats.compatibleBuyers}
                </p>
                <p className="text-xs text-brand-gray">Acheteurs compatibles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-secondary/10 rounded-lg flex items-center justify-center">
                <Unlock className="h-5 w-5 text-brand-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-dark">
                  {stats.activatedSpaces}
                </p>
                <p className="text-xs text-brand-gray">Espaces activés</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-dark">{stats.views}</p>
                <p className="text-xs text-brand-gray">Vues profil</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Property card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Mon bien
            </CardTitle>
          </CardHeader>
          <CardContent>
            {property ? (
              <div className="space-y-4">
                <div className="aspect-video bg-brand-background rounded-lg flex items-center justify-center">
                  <Home className="h-12 w-12 text-brand-gray" />
                </div>
                <div>
                  <p className="font-semibold text-brand-dark">
                    {propertyTypeLabels[property.propertyType] || property.propertyType}{" "}
                    {property.bedrooms} chambre{property.bedrooms > 1 ? "s" : ""}
                  </p>
                  <p className="text-sm text-brand-gray">
                    {property.commune}, {property.postalCode}
                  </p>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-gray">Prix</span>
                  <span className="font-semibold">
                    {formatPrice(property.askingPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-gray">Surface</span>
                  <span className="font-semibold">{property.surface} m²</span>
                </div>
                <Link href="/dashboard/seller/property">
                  <Button variant="outline" className="w-full">
                    Modifier
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <Home className="h-12 w-12 text-brand-gray mx-auto mb-4" />
                <p className="text-brand-gray mb-4">
                  Ajoutez votre bien pour voir les acheteurs compatibles
                </p>
                <Link href="/dashboard/seller/property">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Matches */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Acheteurs compatibles
            </CardTitle>
            <Link href="/dashboard/seller/matches">
              <Button variant="ghost" size="sm">
                Voir tout
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentMatches.length > 0 ? (
              <div className="space-y-4">
                {recentMatches.map((match) => (
                  <div
                    key={match.id}
                    className="flex items-center gap-4 p-4 bg-brand-background rounded-xl"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        match.compatibilityGrade === "A"
                          ? "bg-green-100"
                          : match.compatibilityGrade === "B"
                          ? "bg-blue-100"
                          : "bg-yellow-100"
                      }`}
                    >
                      <span
                        className={`font-bold ${
                          match.compatibilityGrade === "A"
                            ? "text-green-600"
                            : match.compatibilityGrade === "B"
                            ? "text-blue-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {getInitials(match)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant={
                            match.compatibilityGrade === "A"
                              ? "grade_a"
                              : match.compatibilityGrade === "B"
                              ? "grade_b"
                              : "grade_c"
                          }
                        >
                          {match.compatibilityScore}%
                        </Badge>
                        {match.sellerUnlocked && (
                          <Badge variant="success">Activé</Badge>
                        )}
                      </div>
                      <p className="text-sm text-brand-gray truncate">
                        {formatPrice(match.buyer.budgetMin)} -{" "}
                        {formatPrice(match.buyer.budgetMax)} •{" "}
                        {timingLabels[match.buyer.timing] || match.buyer.timing}
                      </p>
                      <p className="text-xs text-brand-secondary">
                        {financingLabels[match.buyer.financingStatus] ||
                          match.buyer.financingStatus}
                      </p>
                    </div>
                    {!match.sellerUnlocked && (
                      <Link href="/dashboard/seller/matches">
                        <Button size="sm">
                          <Unlock className="h-4 w-4 mr-1" />
                          79 €
                        </Button>
                      </Link>
                    )}
                    {match.sellerUnlocked && (
                      <Link href="/dashboard/seller/matches">
                        <Button size="sm" variant="outline">
                          Contacter
                        </Button>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-brand-gray mx-auto mb-4" />
                <p className="text-brand-gray">
                  {hasProperty
                    ? "Aucun acheteur compatible pour le moment"
                    : "Ajoutez votre bien pour voir les acheteurs compatibles"}
                </p>
              </div>
            )}

            {/* CTA */}
            {recentMatches.length > 0 && (
              <div className="mt-6 p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-brand-dark">
                      Activez un espace d'échange
                    </p>
                    <p className="text-sm text-brand-gray">
                      79 € par espace d'échange privé
                    </p>
                  </div>
                  <Link href="/dashboard/seller/matches">
                    <Button>Voir les acheteurs</Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
