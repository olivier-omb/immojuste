"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, CreditCard, TrendingUp, Receipt, PiggyBank } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface PaymentItem {
  id: string;
  amount: number;
  currency: string;
  type: string;
  status: string;
  stripePaymentId: string;
  createdAt: string;
  user: { firstName: string | null; lastName: string | null; email: string; role: string };
}

interface Summary {
  totalRevenue: number;
  totalPayments: number;
  averagePayment: number;
  sellerUnlocks: { revenue: number; count: number };
  agentSubscriptions: { revenue: number; count: number };
}

const TYPE_FILTERS = [
  { label: "Tous", value: "" },
  { label: "Activations", value: "SELLER_SINGLE_UNLOCK" },
  { label: "Abonnements", value: "AGENT_SUBSCRIPTION" },
];

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "15");
    if (typeFilter) params.set("type", typeFilter);

    const res = await fetch(`/api/admin/payments?${params.toString()}`);
    const data = await res.json();
    setPayments(data.payments || []);
    setSummary(data.summary || null);
    setTotal(data.total || 0);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  }, [page, typeFilter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  useEffect(() => {
    setPage(1);
  }, [typeFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-brand-primary" />
          Paiements
        </h1>
        <p className="text-brand-gray text-sm mt-1">{total} paiements au total</p>
      </div>

      {/* Summary stats */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-brand-gray">Revenue totale</p>
                  <p className="text-xl font-bold text-brand-dark">{formatPrice(summary.totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-brand-gray">Nb. paiements</p>
                  <p className="text-xl font-bold text-brand-dark">{summary.totalPayments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <PiggyBank className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-brand-gray">Panier moyen</p>
                  <p className="text-xl font-bold text-brand-dark">{formatPrice(summary.averagePayment)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-brand-gray">Activations (79€)</p>
                  <p className="text-xl font-bold text-brand-dark">{summary.sellerUnlocks.count}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setTypeFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              typeFilter === f.value
                ? "bg-white text-brand-dark shadow-sm"
                : "text-brand-gray hover:text-brand-dark"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card className="border-0 shadow-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-medium text-brand-gray uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-brand-gray uppercase">Utilisateur</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-brand-gray uppercase">Type</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-brand-gray uppercase">Montant</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-brand-gray uppercase">Statut</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-brand-gray uppercase hidden lg:table-cell">Stripe ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6} className="px-6 py-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-brand-gray text-sm">
                      Aucun paiement trouvé
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 text-sm text-brand-gray">
                        {new Date(payment.createdAt).toLocaleDateString("fr-BE", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-brand-dark">
                          {`${payment.user.firstName || ""} ${payment.user.lastName || ""}`.trim() || payment.user.email}
                        </p>
                        <p className="text-xs text-brand-gray">{payment.user.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={payment.type === "SELLER_SINGLE_UNLOCK" ? "info" : "secondary"} size="sm">
                          {payment.type === "SELLER_SINGLE_UNLOCK" ? "Activation" : "Abonnement"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-medium">{formatPrice(payment.amount / 100)}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge
                          variant={payment.status === "COMPLETED" ? "success" : payment.status === "FAILED" ? "error" : "warning"}
                          size="sm"
                        >
                          {payment.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="text-xs text-brand-gray font-mono">
                          {payment.stripePaymentId.substring(0, 20)}...
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
