"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import {
  Users,
  Filter,
  Euro,
  MapPin,
  Clock,
  CreditCard,
  Star,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  Phone,
  Mail,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Lead {
  id: string;
  status: "NEW" | "CONTACTED" | "IN_PROGRESS" | "CONVERTED" | "LOST";
  compatibilityScore: number;
  buyer: {
    id: string;
    budgetMin: number;
    budgetMax: number;
    timing: string;
    financingStatus: string;
    propertyTypes: string[];
    zones: string[];
    qualificationScore: number;
    contact: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string | null;
    };
  };
  createdAt: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  NEW: { label: "Nouveau", color: "bg-blue-100 text-blue-700" },
  CONTACTED: { label: "Contacté", color: "bg-yellow-100 text-yellow-700" },
  IN_PROGRESS: { label: "En cours", color: "bg-purple-100 text-purple-700" },
  CONVERTED: { label: "Converti", color: "bg-green-100 text-green-700" },
  LOST: { label: "Perdu", color: "bg-red-100 text-red-700" },
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

export default function AgentLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filter, setFilter] = useState<"all" | "NEW" | "CONTACTED" | "IN_PROGRESS">("all");

  useEffect(() => {
    async function loadLeads() {
      try {
        const res = await fetch("/api/agents/leads");
        if (res.ok) {
          const data = await res.json();
          setLeads(data);
        }
      } catch (err) {
        console.error("Failed to load leads:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadLeads();
  }, []);

  const updateLeadStatus = async (leadId: string, status: string) => {
    try {
      const res = await fetch(`/api/agents/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: status as Lead["status"] } : l))
        );
        if (selectedLead?.id === leadId) {
          setSelectedLead((prev) => prev ? { ...prev, status: status as Lead["status"] } : null);
        }
      }
    } catch (err) {
      console.error("Failed to update lead:", err);
    }
  };

  const filteredLeads =
    filter === "all" ? leads : leads.filter((l) => l.status === filter);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-BE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-dark">
            Mes leads
          </h1>
          <p className="text-brand-gray mt-1">
            {leads.length} acheteur{leads.length > 1 ? "s" : ""} qualifié{leads.length > 1 ? "s" : ""} dans vos zones
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="default" size="sm">
            {leads.filter((l) => l.status === "NEW").length} nouveau{leads.filter((l) => l.status === "NEW").length > 1 ? "x" : ""}
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-brand-dark">{leads.length}</p>
            <p className="text-sm text-brand-gray">Total leads</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {leads.filter((l) => l.status === "NEW").length}
            </p>
            <p className="text-sm text-brand-gray">Nouveaux</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">
              {leads.filter((l) => l.status === "IN_PROGRESS").length}
            </p>
            <p className="text-sm text-brand-gray">En cours</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-brand-secondary">
              {leads.filter((l) => l.status === "CONVERTED").length}
            </p>
            <p className="text-sm text-brand-gray">Convertis</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-brand-gray" />
        {(["all", "NEW", "CONTACTED", "IN_PROGRESS"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm transition-all",
              filter === f
                ? "bg-brand-dark text-white"
                : "bg-white text-brand-gray hover:bg-brand-background"
            )}
          >
            {f === "all" ? "Tous" : statusLabels[f]?.label}
          </button>
        ))}
      </div>

      {/* Leads list */}
      {filteredLeads.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-brand-gray-light mb-4" />
            <h3 className="text-lg font-semibold text-brand-dark mb-2">
              Aucun lead pour le moment
            </h3>
            <p className="text-brand-gray text-center">
              Des leads apparaîtront ici lorsque des acheteurs qualifiés rechercheront dans vos zones.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredLeads.map((lead) => (
            <Card
              key={lead.id}
              className="cursor-pointer hover:shadow-card-hover transition-all"
              onClick={() => setSelectedLead(lead)}
            >
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-bold text-brand-primary">
                      {lead.buyer.contact.firstName[0]}
                      {lead.buyer.contact.lastName[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-brand-dark">
                        {lead.buyer.contact.firstName} {lead.buyer.contact.lastName}
                      </p>
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", statusLabels[lead.status]?.color)}>
                        {statusLabels[lead.status]?.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-brand-gray">
                      <span className="flex items-center gap-1">
                        <Euro className="h-3.5 w-3.5" />
                        {formatPrice(lead.buyer.budgetMin)} - {formatPrice(lead.buyer.budgetMax)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {lead.buyer.zones.slice(0, 2).join(", ")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {timingLabels[lead.buyer.timing] || lead.buyer.timing}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-400" />
                    <span className="font-semibold text-sm">{lead.buyer.qualificationScore}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-brand-gray" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        title="Détail du lead"
        size="lg"
      >
        {selectedLead && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center">
                <span className="font-bold text-xl text-brand-primary">
                  {selectedLead.buyer.contact.firstName[0]}
                  {selectedLead.buyer.contact.lastName[0]}
                </span>
              </div>
              <div>
                <p className="text-xl font-bold text-brand-dark">
                  {selectedLead.buyer.contact.firstName} {selectedLead.buyer.contact.lastName}
                </p>
                <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", statusLabels[selectedLead.status]?.color)}>
                  {statusLabels[selectedLead.status]?.label}
                </span>
              </div>
            </div>

            {/* Contact */}
            <div className="p-4 bg-brand-background rounded-xl space-y-2">
              <p className="text-sm font-medium text-brand-dark mb-2">Coordonnées</p>
              <p className="text-sm flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-gray" />
                {selectedLead.buyer.contact.email}
              </p>
              {selectedLead.buyer.contact.phone && (
                <p className="text-sm flex items-center gap-2">
                  <Phone className="h-4 w-4 text-brand-gray" />
                  {selectedLead.buyer.contact.phone}
                </p>
              )}
            </div>

            {/* Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-brand-gray">Budget</p>
                  <p className="font-semibold">
                    {formatPrice(selectedLead.buyer.budgetMin)} - {formatPrice(selectedLead.buyer.budgetMax)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-brand-gray">Timing</p>
                  <p className="font-semibold">
                    {timingLabels[selectedLead.buyer.timing] || selectedLead.buyer.timing}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-brand-gray">Financement</p>
                  <p className={cn("font-semibold",
                    ["APPROVED", "CASH", "PRE_APPROVED"].includes(selectedLead.buyer.financingStatus) && "text-brand-secondary"
                  )}>
                    {financingLabels[selectedLead.buyer.financingStatus] || selectedLead.buyer.financingStatus}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-brand-gray">Zones recherchées</p>
                  <p className="font-semibold">{selectedLead.buyer.zones.join(", ")}</p>
                </div>
                <div>
                  <p className="text-sm text-brand-gray">Score de qualification</p>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-400" />
                    <span className="text-lg font-bold">{selectedLead.buyer.qualificationScore}/100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status update */}
            <div>
              <p className="text-sm text-brand-gray mb-3">Mettre à jour le statut</p>
              <div className="flex flex-wrap gap-2">
                {(["NEW", "CONTACTED", "IN_PROGRESS", "CONVERTED", "LOST"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateLeadStatus(selectedLead.id, s)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                      selectedLead.status === s
                        ? statusLabels[s]?.color
                        : "bg-brand-gray-light/50 text-brand-gray hover:bg-brand-gray-light"
                    )}
                  >
                    {statusLabels[s]?.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                className="flex-1"
                onClick={() => {
                  window.location.href = `mailto:${selectedLead.buyer.contact.email}`;
                }}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              {selectedLead.buyer.contact.phone && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    window.location.href = `tel:${selectedLead.buyer.contact.phone}`;
                  }}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
