"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Euro,
  MapPin,
  Clock,
  CreditCard,
  Home,
  Plus,
  X,
  Save,
  CheckCircle,
  Loader2,
  Phone,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const buyerProfileSchema = z.object({
  budgetMin: z.number().min(0),
  budgetMax: z.number().min(0),
  downPayment: z.number().optional(),
  financingStatus: z.string(),
  bankName: z.string().optional(),
  timing: z.string(),
  propertyTypes: z.array(z.string()),
  minBedrooms: z.number().optional(),
  minSurface: z.number().optional(),
});

type BuyerProfileForm = z.infer<typeof buyerProfileSchema>;

const timingOptions = [
  { value: "URGENT", label: "0-3 mois (Urgent)" },
  { value: "SHORT_TERM", label: "3-6 mois" },
  { value: "MEDIUM_TERM", label: "6-12 mois" },
  { value: "FLEXIBLE", label: "12+ mois (Flexible)" },
];

const financingOptions = [
  { value: "NOT_STARTED", label: "Pas encore commencé" },
  { value: "SIMULATED", label: "Simulation effectuée" },
  { value: "PRE_APPROVED", label: "Pré-approuvé par une banque" },
  { value: "APPROVED", label: "Crédit approuvé" },
  { value: "CASH", label: "Achat comptant" },
];

const propertyTypeOptions = [
  { value: "APARTMENT", label: "Appartement" },
  { value: "HOUSE", label: "Maison" },
  { value: "STUDIO", label: "Studio" },
  { value: "DUPLEX", label: "Duplex" },
  { value: "VILLA", label: "Villa" },
  { value: "LOFT", label: "Loft" },
];

const features = [
  "Terrasse",
  "Balcon",
  "Jardin",
  "Parking",
  "Cave",
  "Garage",
  "Ascenseur",
  "Piscine",
];

const dealbreakers = [
  "Rez-de-chaussée",
  "Travaux lourds",
  "Pas de parking",
  "Pas d'extérieur",
  "Rue passante",
  "Copropriété difficile",
];

const brusselsCommunes = [
  "Anderlecht",
  "Auderghem",
  "Berchem-Sainte-Agathe",
  "Bruxelles-Ville",
  "Etterbeek",
  "Evere",
  "Forest",
  "Ganshoren",
  "Ixelles",
  "Jette",
  "Koekelberg",
  "Molenbeek-Saint-Jean",
  "Saint-Gilles",
  "Saint-Josse-ten-Noode",
  "Schaerbeek",
  "Uccle",
  "Watermael-Boitsfort",
  "Woluwe-Saint-Lambert",
  "Woluwe-Saint-Pierre",
];

export default function BuyerProfilePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [zones, setZones] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedDealbreakers, setSelectedDealbreakers] = useState<string[]>([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BuyerProfileForm>({
    resolver: zodResolver(buyerProfileSchema),
    defaultValues: {
      budgetMin: 200000,
      budgetMax: 400000,
      financingStatus: "NOT_STARTED",
      timing: "MEDIUM_TERM",
      propertyTypes: [],
    },
  });

  // Load existing profile data
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/buyers/profile");
        if (res.ok) {
          const profile = await res.json();
          reset({
            budgetMin: profile.budgetMin || 200000,
            budgetMax: profile.budgetMax || 400000,
            downPayment: profile.downPayment || undefined,
            financingStatus: profile.financingStatus || "NOT_STARTED",
            bankName: profile.bankName || "",
            timing: profile.timing || "MEDIUM_TERM",
            propertyTypes: profile.propertyTypes || [],
            minBedrooms: profile.minBedrooms || undefined,
            minSurface: profile.minSurface || undefined,
          });
          if (profile.phone) setPhoneNumber(profile.phone);
          if (profile.consentTerms !== undefined) setConsentTerms(profile.consentTerms);
          if (profile.consentPrivacy !== undefined) setConsentPrivacy(profile.consentPrivacy);
          if (profile.consentMarketing !== undefined) setConsentMarketing(profile.consentMarketing);
          if (profile.zones?.length > 0) {
            setZones(profile.zones.map((z: { commune: string }) => z.commune));
          }
          if (profile.mustHave?.length > 0) {
            setSelectedFeatures(profile.mustHave);
          }
          if (profile.dealbreakers?.length > 0) {
            setSelectedDealbreakers(profile.dealbreakers);
          }
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setIsFetching(false);
      }
    }
    loadProfile();
  }, [reset]);

  const selectedTypes = watch("propertyTypes") || [];

  const togglePropertyType = (type: string) => {
    const current = selectedTypes;
    if (current.includes(type)) {
      setValue(
        "propertyTypes",
        current.filter((t) => t !== type)
      );
    } else {
      setValue("propertyTypes", [...current, type]);
    }
  };

  const addZone = (zone: string) => {
    if (!zones.includes(zone)) {
      setZones([...zones, zone]);
    }
  };

  const removeZone = (zone: string) => {
    setZones(zones.filter((z) => z !== zone));
  };

  const toggleFeature = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

  const toggleDealbreaker = (db: string) => {
    if (selectedDealbreakers.includes(db)) {
      setSelectedDealbreakers(selectedDealbreakers.filter((d) => d !== db));
    } else {
      setSelectedDealbreakers([...selectedDealbreakers, db]);
    }
  };

  const onSubmit = async (data: BuyerProfileForm) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        ...data,
        phone: phoneNumber,
        consentTerms,
        consentPrivacy,
        consentMarketing,
        zones: zones.map((commune) => ({ commune })),
        mustHave: selectedFeatures,
        dealbreakers: selectedDealbreakers,
      };

      const res = await fetch("/api/buyers/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Une erreur est survenue");
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Budget" },
    { number: 2, title: "Zones" },
    { number: 3, title: "Critères" },
    { number: 4, title: "Financement" },
    { number: 5, title: "Infos" },
  ];

  const completionScore = Math.round(
    ((watch("budgetMax") > 0 ? 25 : 0) +
      (zones.length > 0 ? 25 : 0) +
      (selectedTypes.length > 0 ? 25 : 0) +
      (watch("financingStatus") !== "NOT_STARTED" ? 25 : 0))
  );

  if (isFetching) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-brand-dark">
          Mon profil acheteur
        </h1>
        <p className="text-brand-gray mt-1">
          Complétez votre profil pour être visible auprès des vendeurs
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium text-brand-dark">
              Score de qualification
            </span>
            <Badge
              variant={
                completionScore >= 80
                  ? "success"
                  : completionScore >= 50
                  ? "warning"
                  : "error"
              }
            >
              {completionScore}%
            </Badge>
          </div>
          <Progress value={completionScore} />
          <p className="text-sm text-brand-gray mt-2">
            {completionScore < 50
              ? "Complétez votre profil pour augmenter votre visibilité"
              : completionScore < 80
              ? "Bon début ! Ajoutez plus de détails pour de meilleurs matches"
              : "Excellent ! Votre profil est bien rempli"}
          </p>
        </CardContent>
      </Card>

      {/* Step navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <button
            key={s.number}
            onClick={() => setStep(s.number)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all",
              step === s.number
                ? "bg-brand-primary text-white"
                : "bg-white text-brand-gray hover:bg-brand-background"
            )}
          >
            <span
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium",
                step === s.number
                  ? "bg-white/20 text-white"
                  : "bg-brand-gray-light text-brand-gray"
              )}
            >
              {s.number}
            </span>
            {s.title}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Budget */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Euro className="h-5 w-5 text-brand-primary" />
                Budget
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  type="number"
                  label="Budget minimum"
                  placeholder="200000"
                  {...register("budgetMin", { valueAsNumber: true })}
                  error={errors.budgetMin?.message}
                />
                <Input
                  type="number"
                  label="Budget maximum"
                  placeholder="400000"
                  {...register("budgetMax", { valueAsNumber: true })}
                  error={errors.budgetMax?.message}
                />
              </div>
              <Input
                type="number"
                label="Apport personnel (optionnel)"
                placeholder="50000"
                hint="Montant disponible immédiatement"
                {...register("downPayment", { valueAsNumber: true })}
              />

              <div className="flex justify-between">
                <div />
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep(2)}>
                    Suivant
                  </Button>
                  <Button type="submit" isLoading={isLoading}>
                    {saved ? <><CheckCircle className="h-4 w-4 mr-2" />Enregistré !</> : <><Save className="h-4 w-4 mr-2" />Enregistrer</>}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Zones */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-brand-primary" />
                Zones de recherche
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selected zones */}
              {zones.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {zones.map((zone) => (
                    <Badge
                      key={zone}
                      variant="default"
                      className="flex items-center gap-1 pr-1"
                    >
                      {zone}
                      <button
                        type="button"
                        onClick={() => removeZone(zone)}
                        className="p-0.5 rounded-full hover:bg-brand-primary-dark"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Zone selector */}
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-2">
                  Communes de Bruxelles
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto p-1">
                  {brusselsCommunes.map((commune) => (
                    <button
                      key={commune}
                      type="button"
                      onClick={() =>
                        zones.includes(commune)
                          ? removeZone(commune)
                          : addZone(commune)
                      }
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm text-left transition-all",
                        zones.includes(commune)
                          ? "bg-brand-primary text-white"
                          : "bg-brand-background text-brand-dark hover:bg-brand-gray-light"
                      )}
                    >
                      {commune}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Précédent
                </Button>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep(3)}>
                    Suivant
                  </Button>
                  <Button type="submit" isLoading={isLoading}>
                    {saved ? <><CheckCircle className="h-4 w-4 mr-2" />Enregistré !</> : <><Save className="h-4 w-4 mr-2" />Enregistrer</>}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Criteria */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-brand-primary" />
                Critères du bien
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Property types */}
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-2">
                  Type de bien
                </label>
                <div className="flex flex-wrap gap-2">
                  {propertyTypeOptions.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => togglePropertyType(type.value)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm transition-all",
                        selectedTypes.includes(type.value)
                          ? "bg-brand-primary text-white"
                          : "bg-brand-background text-brand-dark hover:bg-brand-gray-light"
                      )}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  type="number"
                  label="Chambres minimum"
                  placeholder="2"
                  {...register("minBedrooms", { valueAsNumber: true })}
                />
                <Input
                  type="number"
                  label="Surface minimum (m²)"
                  placeholder="70"
                  {...register("minSurface", { valueAsNumber: true })}
                />
              </div>

              {/* Must have */}
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-2">
                  Indispensables (must have)
                </label>
                <div className="flex flex-wrap gap-2">
                  {features.map((feature) => (
                    <button
                      key={feature}
                      type="button"
                      onClick={() => toggleFeature(feature)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm transition-all border",
                        selectedFeatures.includes(feature)
                          ? "bg-brand-secondary text-white border-brand-secondary"
                          : "bg-white text-brand-gray border-brand-gray-light hover:border-brand-gray"
                      )}
                    >
                      {selectedFeatures.includes(feature) && (
                        <CheckCircle className="h-3 w-3 inline mr-1" />
                      )}
                      {feature}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dealbreakers */}
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-2">
                  Critères éliminatoires
                </label>
                <div className="flex flex-wrap gap-2">
                  {dealbreakers.map((db) => (
                    <button
                      key={db}
                      type="button"
                      onClick={() => toggleDealbreaker(db)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm transition-all border",
                        selectedDealbreakers.includes(db)
                          ? "bg-error text-white border-error"
                          : "bg-white text-brand-gray border-brand-gray-light hover:border-brand-gray"
                      )}
                    >
                      {selectedDealbreakers.includes(db) && (
                        <X className="h-3 w-3 inline mr-1" />
                      )}
                      {db}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>
                  Précédent
                </Button>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep(4)}>
                    Suivant
                  </Button>
                  <Button type="submit" isLoading={isLoading}>
                    {saved ? <><CheckCircle className="h-4 w-4 mr-2" />Enregistré !</> : <><Save className="h-4 w-4 mr-2" />Enregistrer</>}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Financing */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-brand-primary" />
                Financement & Timing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Select
                label="Statut du financement"
                options={financingOptions}
                {...register("financingStatus")}
              />

              <Input
                label="Banque ou courtier (optionnel)"
                placeholder="Ex: ING, BNP Paribas..."
                {...register("bankName")}
              />

              <Select
                label="Timing d'achat"
                options={timingOptions}
                {...register("timing")}
              />

              <div className="bg-brand-background rounded-lg p-4">
                <p className="text-sm text-brand-gray">
                  <strong className="text-brand-dark">Conseil :</strong> Un
                  financement pré-approuvé augmente significativement vos chances
                  d'être contacté par des vendeurs. Vous pourrez uploader une
                  attestation plus tard.
                </p>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(3)}>
                  Précédent
                </Button>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep(5)}>
                    Suivant
                  </Button>
                  <Button type="submit" isLoading={isLoading}>
                    {saved ? <><CheckCircle className="h-4 w-4 mr-2" />Enregistré !</> : <><Save className="h-4 w-4 mr-2" />Enregistrer</>}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Phone & Consents */}
        {step === 5 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-brand-primary" />
                Informations & Consentements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-brand-gray-light rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                  placeholder="+32 xxx xx xx xx"
                />
                <p className="text-xs text-brand-gray mt-1">Utilisé uniquement dans le cadre d'un espace d'échange activé</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-brand-gray-light">
                <h3 className="font-medium text-brand-dark">Consentements</h3>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={consentTerms} onChange={(e) => setConsentTerms(e.target.checked)} className="mt-1 h-4 w-4 rounded" />
                  <span className="text-sm text-brand-gray">
                    J'accepte les Conditions générales d'utilisation
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={consentPrivacy} onChange={(e) => setConsentPrivacy(e.target.checked)} className="mt-1 h-4 w-4 rounded" />
                  <span className="text-sm text-brand-gray">
                    J'accepte la Politique de confidentialité
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={consentMarketing} onChange={(e) => setConsentMarketing(e.target.checked)} className="mt-1 h-4 w-4 rounded" />
                  <span className="text-sm text-brand-gray">
                    Je souhaite recevoir des notifications sur les nouveaux matches
                  </span>
                </label>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(4)}>
                  Précédent
                </Button>
                <Button type="submit" isLoading={isLoading} size="lg">
                  {saved ? <><CheckCircle className="h-4 w-4 mr-2" />Enregistré !</> : <><Save className="h-4 w-4 mr-2" />Enregistrer le profil</>}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
}
