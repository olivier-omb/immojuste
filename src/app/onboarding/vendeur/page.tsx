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
  Home,
  Euro,
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

const conditionOptions = [
  { value: "NEW", label: "Neuf" },
  { value: "EXCELLENT", label: "Excellent" },
  { value: "GOOD", label: "Bon" },
  { value: "TO_REFRESH", label: "À rafraîchir" },
  { value: "TO_RENOVATE", label: "À rénover" },
];

const timingOptions = [
  { value: "URGENT", label: "0-3 mois" },
  { value: "SHORT_TERM", label: "3-6 mois" },
  { value: "MEDIUM_TERM", label: "6-12 mois" },
  { value: "FLEXIBLE", label: "12+ mois" },
];

const featureOptions = [
  "Jardin", "Terrasse", "Garage", "Parking", "Cave",
  "Ascenseur", "Balcon", "Vue dégagée", "Calme",
  "Proche transports", "Lumineux", "Double vitrage",
  "Panneaux solaires", "Domotique",
];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyType: string;
  commune: string;
  postalCode: string;
  surface: number;
  bedrooms: number;
  bathrooms: number;
  condition: string;
  askingPrice: number;
  priceNegotiable: boolean;
  visitAvailability: string;
  timing: string;
  immwebLink: string;
  features: string[];
  consentTerms: boolean;
  consentPrivacy: boolean;
  consentMarketing: boolean;
}

const defaultData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  propertyType: "",
  commune: "",
  postalCode: "",
  surface: 0,
  bedrooms: 0,
  bathrooms: 0,
  condition: "GOOD",
  askingPrice: 0,
  priceNegotiable: true,
  visitAvailability: "",
  timing: "MEDIUM_TERM",
  immwebLink: "",
  features: [],
  consentTerms: false,
  consentPrivacy: false,
  consentMarketing: false,
};

export default function SellerOnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(defaultData);
  const [showOtp, setShowOtp] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setFormDataCb = useCallback((data: FormData) => setFormData(data), []);
  const { clearDraft } = useOnboardingDraft("seller", formData, setFormDataCb);

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
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
      await fetch("/api/onboarding/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          role: "SELLER",
          data: formData,
        }),
      });

      setShowOtp(true);
    } catch {
      setError("Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-dark">
          Inscription vendeur
        </h1>
        <p className="text-brand-gray mt-2">
          Publiez votre bien et trouvez des acheteurs qualifiés
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 max-w-md mx-auto">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={cn("h-2 flex-1 rounded-full transition-colors", s <= step ? "bg-brand-primary" : "bg-brand-gray-light")} />
        ))}
      </div>
      <p className="text-center text-sm text-brand-gray">Étape {step} sur 4</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
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

      {/* Step 2: Bien */}
      {step === 2 && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Home className="h-5 w-5 text-brand-primary" />
              <h2 className="text-lg font-semibold text-brand-dark">Votre bien</h2>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">Type de bien *</label>
              <div className="flex flex-wrap gap-2">
                {propertyTypes.map((type) => (
                  <button key={type.value} type="button" onClick={() => updateField("propertyType", type.value)}
                    className={cn("px-4 py-2 rounded-full text-sm border-2 transition-colors", formData.propertyType === type.value ? "border-brand-primary bg-brand-primary/10 text-brand-primary" : "border-brand-gray-light text-brand-gray hover:border-brand-gray")}>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Commune *</label>
                <Input value={formData.commune} onChange={(e) => updateField("commune", e.target.value)} placeholder="Ixelles" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Code postal *</label>
                <Input value={formData.postalCode} onChange={(e) => updateField("postalCode", e.target.value)} placeholder="1050" />
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Surface (m²) *</label>
                <Input type="number" value={formData.surface || ""} onChange={(e) => updateField("surface", Number(e.target.value))} placeholder="120" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Chambres *</label>
                <Input type="number" value={formData.bedrooms || ""} onChange={(e) => updateField("bedrooms", Number(e.target.value))} placeholder="3" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Salles de bain *</label>
                <Input type="number" value={formData.bathrooms || ""} onChange={(e) => updateField("bathrooms", Number(e.target.value))} placeholder="1" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">État du bien</label>
              <div className="flex flex-wrap gap-2">
                {conditionOptions.map((opt) => (
                  <button key={opt.value} type="button" onClick={() => updateField("condition", opt.value)}
                    className={cn("px-4 py-2 rounded-full text-sm border-2 transition-colors", formData.condition === opt.value ? "border-brand-primary bg-brand-primary/10 text-brand-primary" : "border-brand-gray-light text-brand-gray hover:border-brand-gray")}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)}><ArrowLeft className="h-4 w-4 mr-2" /> Précédent</Button>
              <Button onClick={() => setStep(3)} disabled={!formData.propertyType || !formData.commune || !formData.postalCode || !formData.surface}>
                Suivant <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Prix & dispo */}
      {step === 3 && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Euro className="h-5 w-5 text-brand-primary" />
              <h2 className="text-lg font-semibold text-brand-dark">Prix & disponibilité</h2>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Prix demandé (€) *</label>
              <Input type="number" value={formData.askingPrice || ""} onChange={(e) => updateField("askingPrice", Number(e.target.value))} placeholder="350 000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">Prix négociable ?</label>
              <div className="flex gap-3">
                <button type="button" onClick={() => updateField("priceNegotiable", true)}
                  className={cn("px-6 py-2 rounded-full text-sm border-2 transition-colors", formData.priceNegotiable ? "border-brand-primary bg-brand-primary/10 text-brand-primary" : "border-brand-gray-light text-brand-gray")}>
                  Oui
                </button>
                <button type="button" onClick={() => updateField("priceNegotiable", false)}
                  className={cn("px-6 py-2 rounded-full text-sm border-2 transition-colors", !formData.priceNegotiable ? "border-brand-primary bg-brand-primary/10 text-brand-primary" : "border-brand-gray-light text-brand-gray")}>
                  Non
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Disponibilités pour les visites</label>
              <Input value={formData.visitAvailability} onChange={(e) => updateField("visitAvailability", e.target.value)} placeholder="Weekends, mercredis après-midi..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">Timing de vente souhaité</label>
              <div className="grid sm:grid-cols-2 gap-3">
                {timingOptions.map((opt) => (
                  <button key={opt.value} type="button" onClick={() => updateField("timing", opt.value)}
                    className={cn("p-3 rounded-xl border-2 text-sm text-left transition-colors", formData.timing === opt.value ? "border-brand-primary bg-brand-primary/10" : "border-brand-gray-light hover:border-brand-gray")}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Lien Immoweb (optionnel)</label>
              <Input value={formData.immwebLink} onChange={(e) => updateField("immwebLink", e.target.value)} placeholder="https://www.immoweb.be/..." />
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)}><ArrowLeft className="h-4 w-4 mr-2" /> Précédent</Button>
              <Button onClick={() => setStep(4)} disabled={!formData.askingPrice}>
                Suivant <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Caractéristiques & consentements */}
      {step === 4 && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-brand-primary" />
              <h2 className="text-lg font-semibold text-brand-dark">Caractéristiques & finalisation</h2>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">Caractéristiques du bien</label>
              <div className="flex flex-wrap gap-2">
                {featureOptions.map((f) => (
                  <button key={f} type="button" onClick={() => toggleFeature(f)}
                    className={cn("px-3 py-1.5 rounded-full text-sm border transition-colors", formData.features.includes(f) ? "border-brand-secondary bg-brand-secondary/10 text-brand-secondary" : "border-brand-gray-light text-brand-gray hover:border-brand-gray")}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3 pt-4 border-t border-brand-gray-light">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.consentTerms} onChange={(e) => updateField("consentTerms", e.target.checked)} className="mt-1 h-4 w-4 rounded" />
                <span className="text-sm text-brand-gray">
                  J'accepte les <Link href="/legal/terms" target="_blank" className="text-brand-primary hover:underline">Conditions générales</Link> *
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.consentPrivacy} onChange={(e) => updateField("consentPrivacy", e.target.checked)} className="mt-1 h-4 w-4 rounded" />
                <span className="text-sm text-brand-gray">
                  J'accepte la <Link href="/legal/privacy" target="_blank" className="text-brand-primary hover:underline">Politique de confidentialité</Link> *
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.consentMarketing} onChange={(e) => updateField("consentMarketing", e.target.checked)} className="mt-1 h-4 w-4 rounded" />
                <span className="text-sm text-brand-gray">
                  Je souhaite recevoir des notifications sur les acheteurs compatibles
                </span>
              </label>
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(3)}><ArrowLeft className="h-4 w-4 mr-2" /> Précédent</Button>
              <Button size="lg" onClick={handleSubmit} isLoading={isSaving} disabled={!formData.consentTerms || !formData.consentPrivacy}>
                Créer mon compte
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <SecureAccessSheet isOpen={showOtp} onClose={() => setShowOtp(false)} defaultEmail={formData.email} callbackUrl="/dashboard/seller" />
    </div>
  );
}
