"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Home,
  Euro,
  Shield,
  UserX,
  UserCheck,
  CreditCard,
  GitCompare,
} from "lucide-react";
import { formatPrice, getTimingLabel, getPropertyTypeLabel, getFinancingLabel } from "@/lib/utils";

const ROLE_LABELS: Record<string, string> = {
  BUYER: "Acheteur",
  SELLER: "Vendeur",
  AGENT: "Agent",
  ADMIN: "Admin",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AdminUserDetailPage({ params }: { params: any }) {
  const { id } = use(params) as { id: string };
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/users/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const toggleDisabled = async () => {
    if (!user) return;
    setUpdating(true);
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDisabled: !user.isDisabled }),
    });
    if (res.ok) {
      setUser({ ...user, isDisabled: !user.isDisabled });
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="h-64 bg-white rounded-2xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-brand-gray">Utilisateur non trouvé</p>
        <Button variant="ghost" onClick={() => router.back()} className="mt-4">
          Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">
              {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={user.role === "ADMIN" ? "warning" : "info"}>
                {ROLE_LABELS[user.role] || user.role}
              </Badge>
              <Badge variant={user.isDisabled ? "error" : "success"} size="sm">
                {user.isDisabled ? "Désactivé" : "Actif"}
              </Badge>
            </div>
          </div>
        </div>
        <Button
          variant={user.isDisabled ? "success" : "danger"}
          onClick={toggleDisabled}
          isLoading={updating}
          leftIcon={user.isDisabled ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
        >
          {user.isDisabled ? "Réactiver" : "Désactiver"}
        </Button>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal info */}
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-primary" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-brand-gray" />
              <span className="text-sm">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-gray" />
                <span className="text-sm">{user.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-brand-gray" />
              <span className="text-sm">
                Inscrit le {new Date(user.createdAt).toLocaleDateString("fr-BE", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-100 space-y-1">
              <p className="text-xs text-brand-gray">
                CGV : {user.consentTerms ? "Acceptées" : "Non acceptées"}
              </p>
              <p className="text-xs text-brand-gray">
                Confidentialité : {user.consentPrivacy ? "Acceptée" : "Non acceptée"}
              </p>
              <p className="text-xs text-brand-gray">
                Marketing : {user.consentMarketing ? "Oui" : "Non"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Role-specific profile */}
        {user.role === "BUYER" && user.buyerProfile && (
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Euro className="w-5 h-5 text-brand-primary" />
                Profil acheteur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-brand-gray">Budget</span>
                <span className="text-sm font-medium">
                  {formatPrice(user.buyerProfile.budgetMin)} - {formatPrice(user.buyerProfile.budgetMax)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-brand-gray">Financement</span>
                <span className="text-sm">{getFinancingLabel(user.buyerProfile.financingStatus)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-brand-gray">Timing</span>
                <span className="text-sm">{getTimingLabel(user.buyerProfile.timing)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-brand-gray">Score</span>
                <span className="text-sm font-medium">{user.buyerProfile.qualificationScore}/100</span>
              </div>
              {user.buyerProfile.zones?.length > 0 && (
                <div>
                  <span className="text-sm text-brand-gray">Zones</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.buyerProfile.zones.map((z: { id: string; commune: string }) => (
                      <Badge key={z.id} variant="muted" size="sm">{z.commune}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {user.buyerProfile.propertyTypes?.length > 0 && (
                <div>
                  <span className="text-sm text-brand-gray">Types recherchés</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.buyerProfile.propertyTypes.map((t: string) => (
                      <Badge key={t} variant="muted" size="sm">{getPropertyTypeLabel(t)}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {user.role === "SELLER" && user.sellerProfile && (
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-brand-primary" />
                Profil vendeur
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.sellerProfile.properties?.length > 0 ? (
                <div className="space-y-4">
                  {user.sellerProfile.properties.map((prop: {
                    id: string; commune: string; propertyType: string;
                    askingPrice: number; surface: number; bedrooms: number;
                    matches: { id: string; compatibilityScore: number; compatibilityGrade: string; sellerUnlocked: boolean }[];
                  }) => (
                    <div key={prop.id} className="p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-brand-gray" />
                        <span className="text-sm font-medium">{prop.commune}</span>
                        <Badge variant="muted" size="sm">{getPropertyTypeLabel(prop.propertyType)}</Badge>
                      </div>
                      <div className="flex gap-4 text-xs text-brand-gray">
                        <span>{formatPrice(prop.askingPrice)}</span>
                        <span>{prop.surface}m²</span>
                        <span>{prop.bedrooms} ch.</span>
                        <span>{prop.matches?.length || 0} matches</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-brand-gray">Aucun bien publié</p>
              )}
            </CardContent>
          </Card>
        )}

        {user.role === "AGENT" && user.agentProfile && (
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-primary" />
                Profil agent
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-brand-gray">Agence</span>
                <span className="text-sm font-medium">{user.agentProfile.agencyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-brand-gray">N° IPI</span>
                <span className="text-sm">{user.agentProfile.ipiNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-brand-gray">Abonnement</span>
                <Badge variant={user.agentProfile.subscriptionTier === "NONE" ? "muted" : "success"}>
                  {user.agentProfile.subscriptionTier}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-brand-gray">Leads ce mois</span>
                <span className="text-sm">{user.agentProfile.leadsThisMonth}</span>
              </div>
              {user.agentProfile.zones?.length > 0 && (
                <div>
                  <span className="text-sm text-brand-gray">Zones</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.agentProfile.zones.map((z: { id: string; commune: string }) => (
                      <Badge key={z.id} variant="muted" size="sm">{z.commune}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Matches */}
      {(user.buyerProfile?.matches?.length > 0 ||
        user.sellerProfile?.properties?.some((p: { matches: unknown[] }) => p.matches?.length > 0)) && (
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-brand-primary" />
              Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-4 py-2 text-left text-xs font-medium text-brand-gray">Bien / Acheteur</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-brand-gray">Score</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-brand-gray">Grade</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-brand-gray">Débloqué</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {user.role === "BUYER" && user.buyerProfile?.matches?.map((m: {
                    id: string; compatibilityScore: number; compatibilityGrade: string;
                    sellerUnlocked: boolean; property: { commune: string; askingPrice: number; propertyType: string };
                  }) => (
                    <tr key={m.id}>
                      <td className="px-4 py-2">
                        {m.property.commune} — {getPropertyTypeLabel(m.property.propertyType)} — {formatPrice(m.property.askingPrice)}
                      </td>
                      <td className="px-4 py-2">{m.compatibilityScore}%</td>
                      <td className="px-4 py-2">
                        <Badge variant={m.compatibilityGrade === "A" ? "success" : m.compatibilityGrade === "B" ? "info" : "warning"}>
                          {m.compatibilityGrade}
                        </Badge>
                      </td>
                      <td className="px-4 py-2">
                        <Badge variant={m.sellerUnlocked ? "success" : "muted"} size="sm">
                          {m.sellerUnlocked ? "Oui" : "Non"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {user.role === "SELLER" && user.sellerProfile?.properties?.flatMap((p: {
                    commune: string; matches: {
                      id: string; compatibilityScore: number; compatibilityGrade: string;
                      sellerUnlocked: boolean; buyerProfile: { user: { firstName: string | null; lastName: string | null } };
                    }[];
                  }) =>
                    p.matches?.map((m) => (
                      <tr key={m.id}>
                        <td className="px-4 py-2">
                          {m.buyerProfile?.user
                            ? `${m.buyerProfile.user.firstName || ""} ${m.buyerProfile.user.lastName || ""}`.trim()
                            : "Acheteur"} — {p.commune}
                        </td>
                        <td className="px-4 py-2">{m.compatibilityScore}%</td>
                        <td className="px-4 py-2">
                          <Badge variant={m.compatibilityGrade === "A" ? "success" : m.compatibilityGrade === "B" ? "info" : "warning"}>
                            {m.compatibilityGrade}
                          </Badge>
                        </td>
                        <td className="px-4 py-2">
                          <Badge variant={m.sellerUnlocked ? "success" : "muted"} size="sm">
                            {m.sellerUnlocked ? "Oui" : "Non"}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payments */}
      {user.payments?.length > 0 && (
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-primary" />
              Paiements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {user.payments.map((p: { id: string; amount: number; type: string; status: string; createdAt: string }) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <span className="text-sm font-medium">{formatPrice(p.amount / 100)}</span>
                    <span className="text-xs text-brand-gray ml-2">
                      {p.type === "SELLER_SINGLE_UNLOCK" ? "Activation espace" : "Abonnement"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={p.status === "COMPLETED" ? "success" : p.status === "FAILED" ? "error" : "warning"} size="sm">
                      {p.status}
                    </Badge>
                    <span className="text-xs text-brand-gray">
                      {new Date(p.createdAt).toLocaleDateString("fr-BE")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
