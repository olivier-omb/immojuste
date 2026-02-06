"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import {
  Home,
  Filter,
  CheckCircle,
  Clock,
  Euro,
  MapPin,
  Maximize,
  BedDouble,
  ArrowRight,
  Loader2,
  AlertCircle,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface PropertyMatch {
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
    type: string;
    commune: string;
    askingPrice: number;
    surface: number | null;
    bedrooms: number | null;
    description: string | null;
    features: string[];
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

export default function BuyerMatchesPage() {
  const [matches, setMatches] = useState<PropertyMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<PropertyMatch | null>(null);
  const [filter, setFilter] = useState<"all" | "A" | "B">("all");
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    async function loadMatches() {
      try {
        const res = await fetch("/api/matches");
        if (res.ok) {
          const data = await res.json();
          setMatches(data);
        }
      } catch (err) {
        console.error("Failed to load matches:", err);
        setError("Impossible de charger vos matches");
      } finally {
        setIsLoading(false);
      }
    }
    loadMatches();
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

  const handleConfirmInterest = async (matchId: string) => {
    setIsConfirming(true);
    setError(null);

    try {
      const res = await fetch(`/api/matches/${matchId}/confirm`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la confirmation");
      }

      setMatches((prev) =>
        prev.map((m) =>
          m.id === matchId ? { ...m, buyerConfirmed: true } : m
        )
      );

      if (selectedMatch?.id === matchId) {
        setSelectedMatch((prev) =>
          prev ? { ...prev, buyerConfirmed: true } : null
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la confirmation");
    } finally {
      setIsConfirming(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-brand-primary mx-auto mb-4" />
          <p className="text-brand-gray">Recherche de biens compatibles...</p>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-dark">
            Mes matches
          </h1>
          <p className="text-brand-gray mt-1">
            Biens correspondant à vos critères
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-brand-primary" />
            </div>
            <h3 className="text-lg font-semibold text-brand-dark mb-2">
              Aucun match pour le moment
            </h3>
            <p className="text-brand-gray text-center mb-6 max-w-md">
              Complétez votre profil acheteur pour que notre algorithme puisse
              trouver les biens qui vous correspondent le mieux.
            </p>
            <Link href="/dashboard/buyer/profile">
              <Button className="group">
                Compléter mon profil
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
            Mes matches
          </h1>
          <p className="text-brand-gray mt-1">
            {matches.length} bien{matches.length > 1 ? "s" : ""} correspond
            {matches.length > 1 ? "ent" : ""} à vos critères
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="success" size="sm">
            {matches.filter((m) => m.sellerUnlocked).length} vendeur
            {matches.filter((m) => m.sellerUnlocked).length > 1 ? "s" : ""} intéressé
            {matches.filter((m) => m.sellerUnlocked).length > 1 ? "s" : ""}
          </Badge>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
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
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      match.compatibilityGrade === "A"
                        ? "bg-green-100"
                        : match.compatibilityGrade === "B"
                        ? "bg-blue-100"
                        : "bg-yellow-100"
                    )}
                  >
                    <Home
                      className={cn(
                        "h-6 w-6",
                        match.compatibilityGrade === "A"
                          ? "text-green-600"
                          : match.compatibilityGrade === "B"
                          ? "text-blue-600"
                          : "text-yellow-600"
                      )}
                    />
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
                    <p className="text-sm text-brand-gray mt-1">
                      {propertyTypeLabels[match.property.type] || match.property.type}
                    </p>
                  </div>
                </div>
                {match.sellerUnlocked && (
                  <Badge variant="success" size="sm" icon={<MessageCircle className="w-3 h-3" />}>
                    Contact
                  </Badge>
                )}
              </div>

              {/* Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Euro className="h-4 w-4 text-brand-gray" />
                  <span className="font-semibold text-brand-dark">
                    {formatPrice(match.property.askingPrice)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand-gray" />
                  <span>{match.property.commune}</span>
                </div>
                {match.property.surface && (
                  <div className="flex items-center gap-2">
                    <Maximize className="h-4 w-4 text-brand-gray" />
                    <span>{match.property.surface} m²</span>
                  </div>
                )}
                {match.property.bedrooms && (
                  <div className="flex items-center gap-2">
                    <BedDouble className="h-4 w-4 text-brand-gray" />
                    <span>
                      {match.property.bedrooms} chambre
                      {match.property.bedrooms > 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>

              {/* Features */}
              {match.property.features?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {match.property.features.slice(0, 3).map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                  {match.property.features.length > 3 && (
                    <span className="px-2 py-0.5 bg-brand-gray-light text-brand-gray text-xs rounded-full">
                      +{match.property.features.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Status */}
              <div className="mt-4 pt-4 border-t border-brand-gray-light">
                {match.sellerUnlocked ? (
                  match.buyerConfirmed ? (
                    <div className="flex items-center gap-2 text-brand-secondary text-sm font-medium">
                      <CheckCircle className="h-4 w-4" />
                      Contact confirmé - le vendeur vous contactera
                    </div>
                  ) : (
                    <Button
                      variant="success"
                      className="w-full"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfirmInterest(match.id);
                      }}
                      disabled={isConfirming}
                    >
                      {isConfirming ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Confirmer mon intérêt
                    </Button>
                  )
                ) : (
                  <div className="flex items-center gap-2 text-brand-gray text-sm">
                    <Clock className="h-4 w-4" />
                    En attente - un vendeur pourrait vous contacter
                  </div>
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
        title="Détail du bien"
        size="lg"
      >
        {selectedMatch && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-16 h-16 rounded-xl flex items-center justify-center",
                  selectedMatch.compatibilityGrade === "A"
                    ? "bg-green-100"
                    : selectedMatch.compatibilityGrade === "B"
                    ? "bg-blue-100"
                    : "bg-yellow-100"
                )}
              >
                <Home
                  className={cn(
                    "h-8 w-8",
                    selectedMatch.compatibilityGrade === "A"
                      ? "text-green-600"
                      : selectedMatch.compatibilityGrade === "B"
                      ? "text-blue-600"
                      : "text-yellow-600"
                  )}
                />
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
                    <Badge variant="success">Vendeur intéressé</Badge>
                  )}
                </div>
                <p className="text-lg font-semibold text-brand-dark mt-1">
                  {propertyTypeLabels[selectedMatch.property.type] || selectedMatch.property.type} - {selectedMatch.property.commune}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-brand-gray">Prix demandé</p>
                  <p className="text-xl font-bold text-brand-dark">
                    {formatPrice(selectedMatch.property.askingPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-brand-gray">Localisation</p>
                  <p className="font-semibold">{selectedMatch.property.commune}</p>
                </div>
              </div>
              <div className="space-y-4">
                {selectedMatch.property.surface && (
                  <div>
                    <p className="text-sm text-brand-gray">Surface</p>
                    <p className="font-semibold">{selectedMatch.property.surface} m²</p>
                  </div>
                )}
                {selectedMatch.property.bedrooms && (
                  <div>
                    <p className="text-sm text-brand-gray">Chambres</p>
                    <p className="font-semibold">{selectedMatch.property.bedrooms}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {selectedMatch.property.description && (
              <div>
                <p className="text-sm text-brand-gray mb-2">Description</p>
                <p className="text-brand-dark leading-relaxed">
                  {selectedMatch.property.description}
                </p>
              </div>
            )}

            {/* Features */}
            {selectedMatch.property.features?.length > 0 && (
              <div>
                <p className="text-sm text-brand-gray mb-2">Caractéristiques</p>
                <div className="flex flex-wrap gap-2">
                  {selectedMatch.property.features.map((feature) => (
                    <Badge key={feature} variant="default">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Status info */}
            {selectedMatch.sellerUnlocked && (
              <div className="p-4 bg-brand-secondary/10 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-brand-secondary" />
                  <p className="font-medium text-brand-dark">
                    Un espace d'échange privé a été activé
                  </p>
                </div>
                <p className="text-sm text-brand-gray">
                  {selectedMatch.buyerConfirmed
                    ? "Vous avez confirmé votre intérêt. Le vendeur vous contactera prochainement."
                    : "Confirmez votre intérêt pour que le vendeur puisse vous contacter."}
                </p>
              </div>
            )}

            {/* Action */}
            <div>
              {selectedMatch.sellerUnlocked ? (
                selectedMatch.buyerConfirmed ? (
                  <div className="flex items-center justify-center gap-2 py-3 text-brand-secondary font-medium">
                    <CheckCircle className="h-5 w-5" />
                    Intérêt confirmé
                  </div>
                ) : (
                  <Button
                    variant="success"
                    className="w-full"
                    size="lg"
                    disabled={isConfirming}
                    onClick={() => handleConfirmInterest(selectedMatch.id)}
                  >
                    {isConfirming ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Confirmer mon intérêt
                  </Button>
                )
              ) : (
                <div className="text-center py-3">
                  <p className="text-sm text-brand-gray flex items-center justify-center gap-2">
                    <Clock className="h-4 w-4" />
                    En attente qu'un vendeur débloque votre profil
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
