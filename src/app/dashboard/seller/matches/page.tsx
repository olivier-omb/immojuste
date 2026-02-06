"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import {
  Users,
  Unlock,
  Filter,
  CheckCircle,
  Clock,
  Euro,
  MapPin,
  CreditCard,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface BuyerMatch {
  id: string;
  compatibilityScore: number;
  compatibilityGrade: "A" | "B" | "C";
  status: string;
  sellerUnlocked: boolean;
  sellerUnlockedAt: string | null;
  buyerConfirmed: boolean | null;
  createdAt: string;
  property: {
    id: string;
    commune: string;
    askingPrice: number;
  };
  buyer: {
    id: string;
    budgetMin: number;
    budgetMax: number;
    timing: string;
    financingStatus: string;
    propertyTypes: string[];
    minBedrooms: number | null;
    minSurface: number | null;
    mustHave: string[];
    qualificationScore: number;
    badges: string[];
    zones: string[];
    contact: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string | null;
    } | null;
  };
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

export default function SellerMatchesPage() {
  const [matches, setMatches] = useState<BuyerMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<BuyerMatch | null>(null);
  const [filter, setFilter] = useState<"all" | "A" | "B">("all");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const matchesRes = await fetch("/api/matches");

        if (matchesRes.ok) {
          const data = await matchesRes.json();
          setMatches(data);
        }
      } catch (err) {
        console.error("Failed to load matches:", err);
        setError("Impossible de charger les matches");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredMatches =
    filter === "all"
      ? matches
      : matches.filter((m) => m.compatibilityGrade === filter);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-BE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price);

  const getInitials = (match: BuyerMatch) => {
    if (match.sellerUnlocked && match.buyer.contact) {
      const first = match.buyer.contact.firstName?.[0] || "";
      const last = match.buyer.contact.lastName?.[0] || "";
      return `${first}${last}`.toUpperCase();
    }
    return "??";
  };

  const handleActivateSpace = async (matchId: string) => {
    setIsProcessingPayment(true);
    setError(null);

    try {
      const res = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "seller_unlock",
          matchId,
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
      setIsProcessingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-dark">
            Acheteurs compatibles
          </h1>
          <p className="text-brand-gray mt-1">
            Trouvez des acheteurs pour votre bien
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-brand-gray mb-4" />
            <h3 className="text-lg font-semibold text-brand-dark mb-2">
              Aucun acheteur compatible pour le moment
            </h3>
            <p className="text-brand-gray text-center mb-4 max-w-md">
              Assurez-vous d'avoir bien encodé votre bien avec toutes ses
              caractéristiques pour maximiser vos chances de trouver des
              acheteurs.
            </p>
            <Link href="/dashboard/seller/property">
              <Button>
                <ArrowRight className="h-4 w-4 mr-2" />
                Modifier mon bien
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-dark">
            Acheteurs compatibles
          </h1>
          <p className="text-brand-gray mt-1">
            {matches.length} acheteur{matches.length > 1 ? "s" : ""} correspond
            {matches.length > 1 ? "ent" : ""} à votre bien
          </p>
        </div>
        <div className="text-sm text-brand-gray">
          79 € par espace d'échange activé
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-brand-gray" />
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm transition-all",
            filter === "all"
              ? "bg-brand-dark text-white"
              : "bg-white text-brand-gray hover:bg-brand-background"
          )}
        >
          Tous ({matches.length})
        </button>
        <button
          onClick={() => setFilter("A")}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm transition-all",
            filter === "A"
              ? "bg-green-500 text-white"
              : "bg-white text-brand-gray hover:bg-brand-background"
          )}
        >
          Excellent ({matches.filter((m) => m.compatibilityGrade === "A").length})
        </button>
        <button
          onClick={() => setFilter("B")}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm transition-all",
            filter === "B"
              ? "bg-blue-500 text-white"
              : "bg-white text-brand-gray hover:bg-brand-background"
          )}
        >
          Bon ({matches.filter((m) => m.compatibilityGrade === "B").length})
        </button>
      </div>

      {/* Matches grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMatches.map((match) => (
          <Card
            key={match.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-card-hover",
              match.sellerUnlocked && "ring-2 ring-brand-secondary"
            )}
            onClick={() => setSelectedMatch(match)}
          >
            <CardContent className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center",
                      match.compatibilityGrade === "A"
                        ? "bg-green-100"
                        : match.compatibilityGrade === "B"
                        ? "bg-blue-100"
                        : "bg-yellow-100"
                    )}
                  >
                    <span
                      className={cn(
                        "font-bold",
                        match.compatibilityGrade === "A"
                          ? "text-green-600"
                          : match.compatibilityGrade === "B"
                          ? "text-blue-600"
                          : "text-yellow-600"
                      )}
                    >
                      {getInitials(match)}
                    </span>
                  </div>
                  <div>
                    <Badge
                      variant={
                        match.compatibilityGrade === "A"
                          ? "grade_a"
                          : match.compatibilityGrade === "B"
                          ? "grade_b"
                          : "grade_c"
                      }
                    >
                      {match.compatibilityScore}% compatible
                    </Badge>
                    {match.sellerUnlocked && match.buyer.contact && (
                      <p className="text-sm font-medium text-brand-dark mt-1">
                        {match.buyer.contact.firstName}{" "}
                        {match.buyer.contact.lastName?.[0]}.
                      </p>
                    )}
                  </div>
                </div>
                {match.sellerUnlocked && (
                  <CheckCircle className="h-5 w-5 text-brand-secondary" />
                )}
              </div>

              {/* Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Euro className="h-4 w-4 text-brand-gray" />
                  <span>
                    {formatPrice(match.buyer.budgetMin)} -{" "}
                    {formatPrice(match.buyer.budgetMax)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-brand-gray" />
                  <span>{timingLabels[match.buyer.timing] || match.buyer.timing}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-brand-gray" />
                  <span
                    className={cn(
                      match.buyer.financingStatus === "APPROVED" ||
                        match.buyer.financingStatus === "CASH" ||
                        match.buyer.financingStatus === "PRE_APPROVED"
                        ? "text-brand-secondary font-medium"
                        : ""
                    )}
                  >
                    {financingLabels[match.buyer.financingStatus] ||
                      match.buyer.financingStatus}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand-gray" />
                  <span className="truncate">{match.buyer.zones.join(", ")}</span>
                </div>
              </div>

              {/* Must have */}
              {match.buyer.mustHave.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {match.buyer.mustHave.slice(0, 3).map((item) => (
                    <span
                      key={item}
                      className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary text-xs rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                  {match.buyer.mustHave.length > 3 && (
                    <span className="px-2 py-0.5 bg-brand-gray-light text-brand-gray text-xs rounded-full">
                      +{match.buyer.mustHave.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Action */}
              <div className="mt-4 pt-4 border-t border-brand-gray-light">
                {match.sellerUnlocked ? (
                  <Button variant="success" className="w-full" size="sm">
                    Contacter
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleActivateSpace(match.id);
                    }}
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Unlock className="h-4 w-4 mr-2" />
                    )}
                    Activer l'espace — 79 €
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        title="Profil acheteur"
        size="lg"
      >
        {selectedMatch && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center",
                  selectedMatch.compatibilityGrade === "A"
                    ? "bg-green-100"
                    : selectedMatch.compatibilityGrade === "B"
                    ? "bg-blue-100"
                    : "bg-yellow-100"
                )}
              >
                <span
                  className={cn(
                    "font-bold text-xl",
                    selectedMatch.compatibilityGrade === "A"
                      ? "text-green-600"
                      : selectedMatch.compatibilityGrade === "B"
                      ? "text-blue-600"
                      : "text-yellow-600"
                  )}
                >
                  {getInitials(selectedMatch)}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      selectedMatch.compatibilityGrade === "A"
                        ? "grade_a"
                        : selectedMatch.compatibilityGrade === "B"
                        ? "grade_b"
                        : "grade_c"
                    }
                  >
                    {selectedMatch.compatibilityScore}% compatible
                  </Badge>
                  {selectedMatch.sellerUnlocked && (
                    <Badge variant="success">Espace activé</Badge>
                  )}
                </div>
                {selectedMatch.sellerUnlocked && selectedMatch.buyer.contact && (
                  <p className="text-lg font-semibold text-brand-dark mt-1">
                    {selectedMatch.buyer.contact.firstName}{" "}
                    {selectedMatch.buyer.contact.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-brand-gray">Budget</p>
                  <p className="font-semibold">
                    {formatPrice(selectedMatch.buyer.budgetMin)} -{" "}
                    {formatPrice(selectedMatch.buyer.budgetMax)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-brand-gray">Timing</p>
                  <p className="font-semibold">
                    {timingLabels[selectedMatch.buyer.timing] ||
                      selectedMatch.buyer.timing}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-brand-gray">Financement</p>
                  <p
                    className={cn(
                      "font-semibold",
                      (selectedMatch.buyer.financingStatus === "APPROVED" ||
                        selectedMatch.buyer.financingStatus === "CASH" ||
                        selectedMatch.buyer.financingStatus === "PRE_APPROVED") &&
                        "text-brand-secondary"
                    )}
                  >
                    {financingLabels[selectedMatch.buyer.financingStatus] ||
                      selectedMatch.buyer.financingStatus}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-brand-gray">Zones recherchées</p>
                  <p className="font-semibold">
                    {selectedMatch.buyer.zones.join(", ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-brand-gray">Types de bien</p>
                  <p className="font-semibold">
                    {selectedMatch.buyer.propertyTypes
                      .map((t) => propertyTypeLabels[t] || t)
                      .join(", ")}
                  </p>
                </div>
                {selectedMatch.buyer.minBedrooms && (
                  <div>
                    <p className="text-sm text-brand-gray">Chambres minimum</p>
                    <p className="font-semibold">{selectedMatch.buyer.minBedrooms}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Must have */}
            {selectedMatch.buyer.mustHave.length > 0 && (
              <div>
                <p className="text-sm text-brand-gray mb-2">
                  Critères indispensables
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedMatch.buyer.mustHave.map((item) => (
                    <Badge key={item} variant="default">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Contact info (if unlocked) */}
            {selectedMatch.sellerUnlocked && selectedMatch.buyer.contact && (
              <div className="p-4 bg-brand-secondary/10 rounded-xl">
                <p className="text-sm font-medium text-brand-dark mb-3">
                  Coordonnées
                </p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="text-brand-gray">Email:</span>{" "}
                    {selectedMatch.buyer.contact.email}
                  </p>
                  {selectedMatch.buyer.contact.phone && (
                    <p className="text-sm">
                      <span className="text-brand-gray">Téléphone:</span>{" "}
                      {selectedMatch.buyer.contact.phone}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action */}
            <div className="flex gap-3">
              {selectedMatch.sellerUnlocked && selectedMatch.buyer.contact ? (
                <>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      window.location.href = `mailto:${selectedMatch.buyer.contact!.email}`;
                    }}
                  >
                    Envoyer un email
                  </Button>
                  {selectedMatch.buyer.contact.phone && (
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        window.location.href = `tel:${selectedMatch.buyer.contact!.phone}`;
                      }}
                    >
                      Appeler
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  className="w-full"
                  disabled={isProcessingPayment}
                  onClick={() => handleActivateSpace(selectedMatch.id)}
                >
                  {isProcessingPayment ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Unlock className="h-4 w-4 mr-2" />
                  )}
                  Activer l'espace d'échange — 79 €
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
