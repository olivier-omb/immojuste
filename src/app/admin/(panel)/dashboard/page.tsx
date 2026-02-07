"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  GitCompare,
  CreditCard,
  Unlock,
  TrendingUp,
  UserPlus,
  ArrowRight,
  Activity,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Stats {
  users: { total: number; buyers: number; sellers: number; agents: number; admins: number; newThisWeek: number; newThisMonth: number };
  matches: { total: number; gradeA: number; gradeB: number; gradeC: number; unlocked: number; conversionRate: number };
  properties: { total: number; active: number };
  revenue: { total: number; thisMonth: number; totalPayments: number; paymentsThisMonth: number; byMonth: { month: string; revenue: number; count: number }[] };
}

interface ActivityItem {
  id: string;
  action: string;
  entity: string | null;
  entityId: string | null;
  createdAt: string;
  user: { firstName: string | null; lastName: string | null; email: string } | null;
}

const ACTION_LABELS: Record<string, string> = {
  "user.created": "Nouvel utilisateur",
  "user.updated": "Profil modifié",
  "user.status_changed": "Statut modifié",
  "match.unlocked": "Espace activé",
  "payment.completed": "Paiement reçu",
  "property.created": "Bien publié",
  "profile.updated": "Profil mis à jour",
  "admin.invited": "Invitation admin",
  "admin.registered": "Nouvel admin",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/admin/activity?limit=10").then((r) => r.json()),
    ]).then(([statsData, activityData]) => {
      setStats(statsData);
      setActivities(activityData.activities || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return <div className="text-brand-gray">Erreur de chargement</div>;

  const maxRevenue = Math.max(...stats.revenue.byMonth.map((m) => m.revenue), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">Dashboard</h1>
        <p className="text-brand-gray text-sm mt-1">Vue d'ensemble de la plateforme</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="border-0 shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-gray">Utilisateurs</p>
                <p className="text-3xl font-bold text-brand-dark mt-1">{stats.users.total}</p>
                <p className="text-xs text-brand-primary mt-1">+{stats.users.newThisWeek} cette semaine</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-gray">Matches actifs</p>
                <p className="text-3xl font-bold text-brand-dark mt-1">{stats.matches.total}</p>
                <p className="text-xs text-brand-gray mt-1">{stats.matches.gradeA} grade A</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <GitCompare className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-gray">Revenue totale</p>
                <p className="text-3xl font-bold text-brand-dark mt-1">{formatPrice(stats.revenue.total)}</p>
                <p className="text-xs text-brand-primary mt-1">{formatPrice(stats.revenue.thisMonth)} ce mois</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-gray">Espaces activés</p>
                <p className="text-3xl font-bold text-brand-dark mt-1">{stats.matches.unlocked}</p>
                <p className="text-xs text-brand-gray mt-1">{stats.matches.conversionRate}% conversion</p>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <Unlock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <Card className="border-0 shadow-card xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-brand-primary" />
              Revenue (6 derniers mois)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-48">
              {stats.revenue.byMonth.map((month) => (
                <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-medium text-brand-dark">
                    {month.revenue > 0 ? `${month.revenue}€` : ""}
                  </span>
                  <div
                    className="w-full bg-brand-primary/20 rounded-t-lg relative overflow-hidden transition-all"
                    style={{ height: `${Math.max((month.revenue / maxRevenue) * 160, 4)}px` }}
                  >
                    <div className="absolute inset-0 bg-brand-primary rounded-t-lg" />
                  </div>
                  <span className="text-[10px] text-brand-gray">{month.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Users by role */}
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserPlus className="w-5 h-5 text-brand-primary" />
              Utilisateurs par rôle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Acheteurs", count: stats.users.buyers, color: "bg-blue-500" },
                { label: "Vendeurs", count: stats.users.sellers, color: "bg-green-500" },
                { label: "Agents", count: stats.users.agents, color: "bg-purple-500" },
                { label: "Admins", count: stats.users.admins, color: "bg-amber-500" },
              ].map((role) => (
                <div key={role.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-brand-gray">{role.label}</span>
                    <span className="font-medium text-brand-dark">{role.count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${role.color} rounded-full transition-all`}
                      style={{ width: `${stats.users.total > 0 ? (role.count / stats.users.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-brand-gray">Biens actifs</span>
                <span className="font-medium text-brand-dark">{stats.properties.active}/{stats.properties.total}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity + Quick actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="border-0 shadow-card xl:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="w-5 h-5 text-brand-primary" />
                Activité récente
              </CardTitle>
              <Link href="/admin/users">
                <Button variant="ghost" size="sm">
                  Tout voir <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <p className="text-brand-gray text-sm text-center py-8">
                Aucune activité récente
              </p>
            ) : (
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-brand-primary rounded-full" />
                      <div>
                        <p className="text-sm text-brand-dark">
                          {ACTION_LABELS[activity.action] || activity.action}
                        </p>
                        <p className="text-xs text-brand-gray">
                          {activity.user
                            ? `${activity.user.firstName || ""} ${activity.user.lastName || ""}`.trim() || activity.user.email
                            : "Système"}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-brand-gray">
                      {new Date(activity.createdAt).toLocaleDateString("fr-BE", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/settings" className="block">
              <Button variant="outline" className="w-full justify-start gap-2">
                <UserPlus className="w-4 h-4" />
                Inviter un admin
              </Button>
            </Link>
            <Link href="/admin/users" className="block">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Users className="w-4 h-4" />
                Gérer les utilisateurs
              </Button>
            </Link>
            <Link href="/admin/payments" className="block">
              <Button variant="outline" className="w-full justify-start gap-2">
                <CreditCard className="w-4 h-4" />
                Voir les paiements
              </Button>
            </Link>
            <Link href="/admin/matches" className="block">
              <Button variant="outline" className="w-full justify-start gap-2">
                <GitCompare className="w-4 h-4" />
                Voir les matches
              </Button>
            </Link>

            <div className="pt-3 border-t border-gray-100">
              <div className="bg-brand-primary/5 rounded-xl p-4">
                <p className="text-sm font-medium text-brand-dark">Taux de conversion</p>
                <p className="text-2xl font-bold text-brand-primary mt-1">{stats.matches.conversionRate}%</p>
                <p className="text-xs text-brand-gray mt-1">
                  {stats.matches.unlocked} espaces activés sur {stats.matches.total} matches
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
