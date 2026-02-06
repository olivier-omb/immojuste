"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SecureAccessSheet } from "@/components/auth/secure-access-sheet";
import { useOnboardingDraft } from "@/hooks/use-onboarding-draft";
import { cn } from "@/lib/utils";
import {
  User,
  Search,
  Clock,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

const propertyTypes = [
  { value: "APARTMENT", label: "Appartement" },
  { value: "HOUSE", label: "Maison" },
  { value: "STUDIO", label: "Studio" },
  { value: "VILLA", label: "Villa" },
  { value: "DUPLEX", label: "Duplex" },
  { value: "LOFT", label: "Loft" },
  { value: "PENTHOUSE", label: "Penthouse" },
];

const timingOptions = [
  { value: "URGENT", label: "0-3 mois" },
  { value: "SHORT_TERM", label: "3-6 mois" },
  { value: "MEDIUM_TERM", label: "6-12 mois" },
  { value: "FLEXIBLE", label: "12+ mois" },
];

const financingOptions = [
  { value: "NOT_STARTED", label: "Pas encore commencé" },
  { value: "SIMULATED", label: "Simulation faite" },
  { value: "PRE_APPROVED", label: "Pré-approuvé" },
  { value: "APPROVED", label: "Crédit approuvé" },
  { value: "CASH", label: "Comptant" },
];

const mustHaveOptions = [
  "Jardin", "Terrasse", "Garage", "Parking", "Cave",
  "Ascenseur", "Balcon", "Vue dégagée", "Calme",
  "Proche transports", "Proche écoles", "Lumineux",
];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  budgetMin: number;
  budgetMax: number;
  propertyTypes: string[];
  zones: string;
  minBedrooms: number;
  minSurface: number;
  timing: string;
  financingStatus: string;
  mustHave: string[];
  dealbreakers: string[];
  consentTerms: boolean;
  consentPrivacy: boolean;
  consentMarketing: boolean;
}

const defaultData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  budgetMin: 0,
  budgetMax: 0,
  propertyTypes: [],
  zones: "",
  minBedrooms: 0,
  minSurface: 0,
  timing: "MEDIUM_TERM",
  financingStatus: "NOT_STARTED",
  mustHave: [],
  dealbreakers: [],
  consentTerms: false,
  consentPrivacy: false,
  consentMarketing: false,
};

export default function BuyerOnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(defaultData);
  const [showOtp, setShowOtp] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setFormDataCb = useCallback((data: FormData) => setFormData(data), []);
  const { clearDraft } = useOnboardingDraft("buyer", formData, setFormDataCb);

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (key: "propertyTypes" | "mustHave" | "dealbreakers", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const handleSubmit = async () => {
    if (!formData.consentTerms || !formData.consentPrivacy) {
      setError("Veuillez accepter les conditions et la politique de confidentialité");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Save draft to API
      const zonesArray = formData.zones
        .split(",")
        .map((z) => z.trim())
        .filter(Boolean)
        .map((commune) => ({ commune, postalCode: "" }));

      await fetch("/api/onboarding/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          role: "BUYER",
          data: { ...formData, zones: zonesArray },
        }),
      });

      // Open OTP sheet
      setShowOtp(true);
    } catch {
      setError("Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const totalSteps = 4;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-dark">
          Inscription acheteur
        </h1>
        <p className="text-brand-gray mt-2">
          Remplissez vos critères pour être mis en relation avec des vendeurs
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 max-w-md mx-auto">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={cn(
              "h-2 flex-1 rounded-full transition-colors",
              s <= step ? "bg-brand-primary" : "bg-brand-gray-light"
            )}
          />
        ))}
      </div>
      <p className="text-center text-sm text-brand-gray">
        Étape {step} sur {totalSteps}
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Step 1: Infos perso */}
      {step === 1 && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-5 w-5 text-brand-primary" />
              <h2 className="text-lg font-semibold text-brand-dark">Vos informations</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Prénom *</label>
                <Input value={formData.firstName} onChange={(e) => updateField("firstName", e.target.value)} placeholder="Votre prénom" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Nom *</label>
                <Input value={formData.lastName} onChange={(e) => updateField("lastName", e.target.value)} placeholder="Votre nom" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Email *</label>
              <Input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} placeholder="votre@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Téléphone *</label>
              <Input type="tel" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+32 xxx xx xx xx" />
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={() => setStep(2)} disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone}>
                Suivant <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Critères */}
      {step === 2 && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Search className="h-5 w-5 text-brand-primary" />
              <h2 className="text-lg font-semibold text-brand-dark">Vos critères de recherche</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Budget minimum *</label>
                <Input type="number" value={formData.budgetMin || ""} onChange={(e) => updateField("budgetMin", Number(e.target.value))} placeholder="200 000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Budget maximum *</label>
                <Input type="number" value={formData.budgetMax || ""} onChange={(e) => updateField("budgetMax", Number(e.target.value))} placeholder="400 000" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">Types de bien *</label>
              <div className="flex flex-wrap gap-2">
                {propertyTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => toggleArrayItem("propertyTypes", type.value)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm border-2 transition-colors",
                      formData.propertyTypes.includes(type.value)
                        ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
                        : "border-brand-gray-light text-brand-gray hover:border-brand-gray"
                    )}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Zones recherchées * (séparées par des virgules)</label>
              <Input value={formData.zones} onChange={(e) => updateField("zones", e.target.value)} placeholder="Ixelles, Uccle, Saint-Gilles..." />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Chambres minimum</label>
                <Input type="number" value={formData.minBedrooms || ""} onChange={(e) => updateField("minBedrooms", Number(e.target.value))} placeholder="2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Surface minimum (m²)</label>
                <Input type="number" value={formData.minSurface || ""} onChange={(e) => updateField("minSurface", Number(e.target.value))} placeholder="80" />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Précédent
              </Button>
              <Button onClick={() => setStep(3)} disabled={!formData.budgetMax || formData.propertyTypes.length === 0 || !formData.zones}>
                Suivant <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Timing & financement */}
      {step === 3 && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-brand-primary" />
              <h2 className="text-lg font-semibold text-brand-dark">Timing & financement</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">Quand souhaitez-vous acheter ?</label>
              <div className="grid sm:grid-cols-2 gap-3">
                {timingOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateField("timing", opt.value)}
                    className={cn(
                      "p-3 rounded-xl border-2 text-sm text-left transition-colors",
                      formData.timing === opt.value
                        ? "border-brand-primary bg-brand-primary/10"
                        : "border-brand-gray-light hover:border-brand-gray"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">État de votre financement</label>
              <div className="space-y-2">
                {financingOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateField("financingStatus", opt.value)}
                    className={cn(
                      "w-full p-3 rounded-xl border-2 text-sm text-left transition-colors",
                      formData.financingStatus === opt.value
                        ? "border-brand-primary bg-brand-primary/10"
                        : "border-brand-gray-light hover:border-brand-gray"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Précédent
              </Button>
              <Button onClick={() => setStep(4)}>
                Suivant <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Préférences & consentements */}
      {step === 4 && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-brand-primary" />
              <h2 className="text-lg font-semibold text-brand-dark">Préférences & finalisation</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">Critères indispensables</label>
              <div className="flex flex-wrap gap-2">
                {mustHaveOptions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleArrayItem("mustHave", item)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm border transition-colors",
                      formData.mustHave.includes(item)
                        ? "border-brand-secondary bg-brand-secondary/10 text-brand-secondary"
                        : "border-brand-gray-light text-brand-gray hover:border-brand-gray"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-brand-gray-light">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.consentTerms}
                  onChange={(e) => updateField("consentTerms", e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-brand-gray-light text-brand-primary focus:ring-brand-primary"
                />
                <span className="text-sm text-brand-gray">
                  J'accepte les{" "}
                  <Link href="/legal/terms" target="_blank" className="text-brand-primary hover:underline">
                    Conditions générales d'utilisation
                  </Link>{" "}
                  *
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.consentPrivacy}
                  onChange={(e) => updateField("consentPrivacy", e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-brand-gray-light text-brand-primary focus:ring-brand-primary"
                />
                <span className="text-sm text-brand-gray">
                  J'accepte la{" "}
                  <Link href="/legal/privacy" target="_blank" className="text-brand-primary hover:underline">
                    Politique de confidentialité
                  </Link>{" "}
                  *
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.consentMarketing}
                  onChange={(e) => updateField("consentMarketing", e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-brand-gray-light text-brand-primary focus:ring-brand-primary"
                />
                <span className="text-sm text-brand-gray">
                  Je souhaite recevoir des notifications par email sur les nouveaux biens correspondants
                </span>
              </label>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(3)}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Précédent
              </Button>
              <Button
                size="lg"
                onClick={handleSubmit}
                isLoading={isSaving}
                disabled={!formData.consentTerms || !formData.consentPrivacy}
              >
                Créer mon compte
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <SecureAccessSheet
        isOpen={showOtp}
        onClose={() => setShowOtp(false)}
        defaultEmail={formData.email}
        callbackUrl="/dashboard/buyer"
      />
    </div>
  );
}
