"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, GitCompare } from "lucide-react";
import { formatPrice, getPropertyTypeLabel } from "@/lib/utils";

interface MatchItem {
  id: string;
  compatibilityScore: number;
  compatibilityGrade: string;
  status: string;
  sellerUnlocked: boolean;
  createdAt: string;
  buyerProfile: {
    user: { firstName: string | null; lastName: string | null; email: string };
  };
  property: {
    commune: string;
    postalCode: string;
    askingPrice: number;
    propertyType: string;
    sellerProfile: {
      user: { firstName: string | null; lastName: string | null; email: string };
    };
  };
  payment: { amount: number; status: string; createdAt: string } | null;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  VIEWED: "Vu",
  UNLOCKED: "Débloqué",
  CONFIRMED: "Confirmé",
  CONTACTED: "Contacté",
  REJECTED: "Rejeté",
  EXPIRED: "Expiré",
};

const GRADE_FILTERS = [
  { label: "Tous", value: "" },
  { label: "Grade A", value: "A" },
  { label: "Grade B", value: "B" },
  { label: "Grade C", value: "C" },
];

const STATUS_FILTERS = [
  { label: "Tous", value: "" },
  { label: "En attente", value: "PENDING" },
  { label: "Débloqué", value: "UNLOCKED" },
  { label: "Confirmé", value: "CONFIRMED" },
  { label: "Contacté", value: "CONTACTED" },
];

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [gradeFilter, setGradeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "15");
    if (gradeFilter) params.set("grade", gradeFilter);
    if (statusFilter) params.set("status", statusFilter);

    const res = await fetch(`/api/admin/matches?${params.toString()}`);
    const data = await res.json();
    setMatches(data.matches || []);
    setTotal(data.total || 0);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  }, [page, gradeFilter, statusFilter]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  useEffect(() => {
    setPage(1);
  }, [gradeFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark flex items-center gap-2">
          <GitCompare className="w-6 h-6 text-brand-primary" />
          Matches
        </h1>
        <p className="text-brand-gray text-sm mt-1">{total} matches au total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {GRADE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setGradeFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                gradeFilter === f.value
                  ? "bg-white text-brand-dark shadow-sm"
                  : "text-brand-gray hover:text-brand-dark"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === f.value
                  ? "bg-white text-brand-dark shadow-sm"
                  : "text-brand-gray hover:text-brand-dark"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className="border-0 shadow-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-medium text-brand-gray uppercase">Acheteur</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-brand-gray uppercase">Bien</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-brand-gray uppercase hidden md:table-cell">Vendeur</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-brand-gray uppercase">Score</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-brand-gray uppercase">Grade</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-brand-gray uppercase">Statut</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-brand-gray uppercase hidden lg:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan={7} className="px-6 py-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : matches.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-brand-gray text-sm">
                      Aucun match trouvé
                    </td>
                  </tr>
                ) : (
                  matches.map((match) => (
                    <tr key={match.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-brand-dark">
                          {`${match.buyerProfile.user.firstName || ""} ${match.buyerProfile.user.lastName || ""}`.trim() || match.buyerProfile.user.email}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm">{match.property.commune}</p>
                        <p className="text-xs text-brand-gray">
                          {getPropertyTypeLabel(match.property.propertyType)} — {formatPrice(match.property.askingPrice)}
                        </p>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <p className="text-sm">
                          {`${match.property.sellerProfile.user.firstName || ""} ${match.property.sellerProfile.user.lastName || ""}`.trim() || match.property.sellerProfile.user.email}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium">{match.compatibilityScore}%</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={match.compatibilityGrade === "A" ? "success" : match.compatibilityGrade === "B" ? "info" : "warning"}>
                          {match.compatibilityGrade}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={match.sellerUnlocked ? "success" : "muted"} size="sm">
                          {STATUS_LABELS[match.status] || match.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="text-xs text-brand-gray">
                          {new Date(match.createdAt).toLocaleDateString("fr-BE")}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <p className="text-sm text-brand-gray">Page {page} sur {totalPages}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
