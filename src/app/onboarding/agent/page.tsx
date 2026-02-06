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
  MapPin,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  agencyName: string;
  ipiNumber: string;
  zones: string;
  specialties: string;
  consentTerms: boolean;
  consentPrivacy: boolean;
  consentMarketing: boolean;
}

const defaultData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  agencyName: "",
  ipiNumber: "",
  zones: "",
  specialties: "",
  consentTerms: false,
  consentPrivacy: false,
  consentMarketing: false,
};

export default function AgentOnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(defaultData);
  const [showOtp, setShowOtp] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setFormDataCb = useCallback((data: FormData) => setFormData(data), []);
  const { clearDraft } = useOnboardingDraft("agent", formData, setFormDataCb);

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.consentTerms || !formData.consentPrivacy) {
      setError("Veuillez accepter les conditions et la politique de confidentialité");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const zonesArray = formData.zones.split(",").map((z) => z.trim()).filter(Boolean);
      const specialtiesArray = formData.specialties.split(",").map((s) => s.trim()).filter(Boolean);

      await fetch("/api/onboarding/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          role: "AGENT",
          data: { ...formData, zones: zonesArray, specialties: specialtiesArray },
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
          Inscription agent immobilier
        </h1>
        <p className="text-brand-gray mt-2">
          Accédez à des leads qualifiés dans vos zones
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 max-w-md mx-auto">
        {[1, 2, 3].map((s) => (
          <div key={s} className={cn("h-2 flex-1 rounded-full transition-colors", s <= step ? "bg-brand-primary" : "bg-brand-gray-light")} />
        ))}
      </div>
      <p className="text-center text-sm text-brand-gray">Étape {step} sur 3</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      {/* Step 1: Infos perso + agence */}
      {step === 1 && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-5 w-5 text-brand-primary" />
              <h2 className="text-lg font-semibold text-brand-dark">Informations personnelles & agence</h2>
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
              <label className="block text-sm font-medium text-brand-dark mb-1">Email professionnel *</label>
              <Input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} placeholder="contact@agence.be" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Téléphone *</label>
              <Input type="tel" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+32 xxx xx xx xx" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Nom de l'agence *</label>
              <Input value={formData.agencyName} onChange={(e) => updateField("agencyName", e.target.value)} placeholder="Mon Agence Immobilière" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Numéro IPI *</label>
              <Input value={formData.ipiNumber} onChange={(e) => updateField("ipiNumber", e.target.value)} placeholder="IPI XXXXXX" />
              <p className="text-xs text-brand-gray mt-1">Numéro d'agréation de l'Institut Professionnel des Agents Immobiliers</p>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={() => setStep(2)} disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.agencyName || !formData.ipiNumber}>
                Suivant <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Zones & spécialités */}
      {step === 2 && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-brand-primary" />
              <h2 className="text-lg font-semibold text-brand-dark">Zones & spécialités</h2>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Zones d'activité * (séparées par des virgules)</label>
              <textarea
                value={formData.zones}
                onChange={(e) => updateField("zones", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-brand-gray-light rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none resize-none"
                placeholder="Ixelles, Saint-Gilles, Uccle, Forest..."
              />
              <p className="text-xs text-brand-gray mt-1">Vous recevrez des leads d'acheteurs recherchant dans ces zones</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Spécialités (séparées par des virgules)</label>
              <textarea
                value={formData.specialties}
                onChange={(e) => updateField("specialties", e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border border-brand-gray-light rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none resize-none"
                placeholder="Appartements, Maisons, Investissement, Neuf..."
              />
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)}><ArrowLeft className="h-4 w-4 mr-2" /> Précédent</Button>
              <Button onClick={() => setStep(3)} disabled={!formData.zones}>
                Suivant <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Consentements */}
      {step === 3 && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-brand-primary" />
              <h2 className="text-lg font-semibold text-brand-dark">Finalisation</h2>
            </div>

            <div className="bg-brand-background rounded-xl p-4">
              <h3 className="font-medium text-brand-dark mb-2">Récapitulatif</h3>
              <div className="space-y-1 text-sm text-brand-gray">
                <p><strong>Agence :</strong> {formData.agencyName}</p>
                <p><strong>N° IPI :</strong> {formData.ipiNumber}</p>
                <p><strong>Zones :</strong> {formData.zones}</p>
                {formData.specialties && <p><strong>Spécialités :</strong> {formData.specialties}</p>}
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
                  Je souhaite recevoir des notifications sur les nouveaux leads
                </span>
              </label>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)}><ArrowLeft className="h-4 w-4 mr-2" /> Précédent</Button>
              <Button size="lg" onClick={handleSubmit} isLoading={isSaving} disabled={!formData.consentTerms || !formData.consentPrivacy}>
                Créer mon compte
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <SecureAccessSheet isOpen={showOtp} onClose={() => setShowOtp(false)} defaultEmail={formData.email} callbackUrl="/dashboard/agent" />
    </div>
  );
}
