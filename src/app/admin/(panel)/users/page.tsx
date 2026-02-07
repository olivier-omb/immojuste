"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronLeft, ChevronRight, Eye } from "lucide-react";

interface UserItem {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  role: string;
  isDisabled: boolean;
  createdAt: string;
  _count: { payments: number; notifications: number };
}

const ROLE_LABELS: Record<string, string> = {
  BUYER: "Acheteur",
  SELLER: "Vendeur",
  AGENT: "Agent",
  ADMIN: "Admin",
};

const ROLE_VARIANTS: Record<string, "default" | "secondary" | "info" | "warning"> = {
  BUYER: "info",
  SELLER: "default",
  AGENT: "secondary",
  ADMIN: "warning",
};

const TABS = [
  { label: "Tous", value: "" },
  { label: "Acheteurs", value: "BUYER" },
  { label: "Vendeurs", value: "SELLER" },
  { label: "Agents", value: "AGENT" },
  { label: "Admins", value: "ADMIN" },
];

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "15");
    if (roleFilter) params.set("role", roleFilter);
    if (search) params.set("search", search);

    const res = await fetch(`/api/admin/users?${params.toString()}`);
    const data = await res.json();
    setUsers(data.users || []);
    setTotal(data.total || 0);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  }, [page, roleFilter, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setPage(1);
  }, [roleFilter, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">Utilisateurs</h1>
        <p className="text-brand-gray text-sm mt-1">{total} utilisateurs au total</p>
      </div>

      {/* Search + Tabs */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-brand-gray-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setRoleFilter(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                roleFilter === tab.value
                  ? "bg-white text-brand-dark shadow-sm"
                  : "text-brand-gray hover:text-brand-dark"
              }`}
            >
              {tab.label}
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
                  <th className="px-6 py-4 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">Utilisateur</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">Rôle</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-brand-gray uppercase tracking-wider hidden md:table-cell">Inscrit le</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-brand-gray uppercase tracking-wider hidden lg:table-cell">Statut</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-brand-gray uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className="px-6 py-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-brand-gray text-sm">
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50/50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/admin/users/${user.id}`)}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-brand-dark">
                            {user.firstName && user.lastName
                              ? `${user.firstName} ${user.lastName}`
                              : user.email}
                          </p>
                          {user.firstName && (
                            <p className="text-xs text-brand-gray">{user.email}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={ROLE_VARIANTS[user.role] || "default"}>
                          {ROLE_LABELS[user.role] || user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-sm text-brand-gray">
                          {new Date(user.createdAt).toLocaleDateString("fr-BE")}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <Badge variant={user.isDisabled ? "error" : "success"} size="sm">
                          {user.isDisabled ? "Désactivé" : "Actif"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/users/${user.id}`);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <p className="text-sm text-brand-gray">
                Page {page} sur {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
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
