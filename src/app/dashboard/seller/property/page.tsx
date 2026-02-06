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
import { Textarea } from "@/components/ui/textarea";
import {
  Home,
  MapPin,
  Euro,
  Ruler,
  BedDouble,
  Bath,
  Calendar,
  Save,
  CheckCircle,
  Upload,
  X,
  Loader2,
  Link2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const propertySchema = z.object({
  commune: z.string().min(1, "Commune requise"),
  postalCode: z.string().min(4, "Code postal requis"),
  address: z.string().optional(),
  propertyType: z.string().min(1, "Type requis"),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  surface: z.number().min(1, "Surface requise"),
  askingPrice: z.number().min(1, "Prix requis"),
  condition: z.string(),
  timing: z.string(),
  description: z.string().optional(),
});

type PropertyForm = z.infer<typeof propertySchema>;

const propertyTypes = [
  { value: "APARTMENT", label: "Appartement" },
  { value: "HOUSE", label: "Maison" },
  { value: "STUDIO", label: "Studio" },
  { value: "DUPLEX", label: "Duplex" },
  { value: "VILLA", label: "Villa" },
  { value: "LOFT", label: "Loft" },
  { value: "PENTHOUSE", label: "Penthouse" },
];

const conditions = [
  { value: "NEW", label: "Neuf" },
  { value: "EXCELLENT", label: "Excellent état" },
  { value: "GOOD", label: "Bon état" },
  { value: "TO_REFRESH", label: "À rafraîchir" },
  { value: "TO_RENOVATE", label: "À rénover" },
];

const timings = [
  { value: "URGENT", label: "Immédiat (0-3 mois)" },
  { value: "SHORT_TERM", label: "Court terme (3-6 mois)" },
  { value: "MEDIUM_TERM", label: "Moyen terme (6-12 mois)" },
  { value: "FLEXIBLE", label: "Flexible (12+ mois)" },
];

const brusselsCommunes = [
  { value: "Ixelles", label: "Ixelles (1050)" },
  { value: "Uccle", label: "Uccle (1180)" },
  { value: "Etterbeek", label: "Etterbeek (1040)" },
  { value: "Schaerbeek", label: "Schaerbeek (1030)" },
  { value: "Saint-Gilles", label: "Saint-Gilles (1060)" },
  { value: "Forest", label: "Forest (1190)" },
  { value: "Woluwe-Saint-Pierre", label: "Woluwe-Saint-Pierre (1150)" },
  { value: "Woluwe-Saint-Lambert", label: "Woluwe-Saint-Lambert (1200)" },
  { value: "Auderghem", label: "Auderghem (1160)" },
  { value: "Bruxelles-Ville", label: "Bruxelles-Ville (1000)" },
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
  "Gardien",
  "Buanderie",
];

export default function PropertyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [saved, setSaved] = useState(false);
  const [acceptsAgents, setAcceptsAgents] = useState(true);
  const [visitAvailability, setVisitAvailability] = useState("");
  const [immwebLink, setImmwebLink] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [existingPropertyId, setExistingPropertyId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PropertyForm>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      condition: "GOOD",
      timing: "MEDIUM_TERM",
      bedrooms: 2,
      bathrooms: 1,
    },
  });

  // Load existing property + seller profile
  useEffect(() => {
    async function loadProperty() {
      try {
        const res = await fetch("/api/properties");
        if (res.ok) {
          const properties = await res.json();
          if (properties.length > 0) {
            const property = properties[0];
            setExistingPropertyId(property.id);
            reset({
              commune: property.commune,
              postalCode: property.postalCode,
              address: property.address || "",
              propertyType: property.propertyType,
              bedrooms: property.bedrooms,
              bathrooms: property.bathrooms,
              surface: property.surface,
              condition: property.condition,
              askingPrice: property.askingPrice,
              timing: property.timing,
              description: property.description || "",
            });
            setSelectedFeatures(property.features || []);
            setAcceptsAgents(property.acceptsAgents);
          }
        }
        // Load seller profile for visitAvailability and immwebLink
        const profileRes = await fetch("/api/sellers/profile");
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.visitAvailability) setVisitAvailability(profileData.visitAvailability);
          if (profileData.immwebLink) setImmwebLink(profileData.immwebLink);
        }
      } catch (err) {
        console.error("Failed to load property:", err);
      } finally {
        setIsFetching(false);
      }
    }
    loadProperty();
  }, [reset]);

  const toggleFeature = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

  const onSubmit = async (data: PropertyForm) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        ...data,
        features: selectedFeatures,
        acceptsAgents,
        visitAvailability,
        immwebLink,
      };

      const url = existingPropertyId
        ? `/api/properties/${existingPropertyId}`
        : "/api/properties";

      const res = await fetch(url, {
        method: existingPropertyId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Une erreur est survenue");
      }

      if (!existingPropertyId && result.property?.id) {
        setExistingPropertyId(result.property.id);
      }

      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        router.push("/dashboard/seller/matches");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Localisation" },
    { number: 2, title: "Caractéristiques" },
    { number: 3, title: "Prix & Timing" },
  ];

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
          Mon bien
        </h1>
        <p className="text-brand-gray mt-1">
          Décrivez votre bien pour trouver des acheteurs compatibles
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Step navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {steps.map((s) => (
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
        {/* Step 1: Location */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-brand-primary" />
                Localisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Select
                label="Commune"
                options={brusselsCommunes}
                placeholder="Sélectionnez une commune"
                {...register("commune")}
                error={errors.commune?.message}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Code postal"
                  placeholder="1050"
                  {...register("postalCode")}
                  error={errors.postalCode?.message}
                />
                <Input
                  label="Adresse (optionnel)"
                  placeholder="Rue de la Paix 123"
                  hint="Restera confidentielle"
                  {...register("address")}
                />
              </div>

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

        {/* Step 2: Characteristics */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-brand-primary" />
                Caractéristiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Select
                label="Type de bien"
                options={propertyTypes}
                placeholder="Sélectionnez un type"
                {...register("propertyType")}
                error={errors.propertyType?.message}
              />

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-2">
                    <BedDouble className="h-4 w-4 inline mr-1" />
                    Chambres
                  </label>
                  <Input
                    type="number"
                    min="0"
                    {...register("bedrooms", { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-2">
                    <Bath className="h-4 w-4 inline mr-1" />
                    SDB
                  </label>
                  <Input
                    type="number"
                    min="0"
                    {...register("bathrooms", { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-2">
                    <Ruler className="h-4 w-4 inline mr-1" />
                    Surface (m²)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    {...register("surface", { valueAsNumber: true })}
                    error={errors.surface?.message}
                  />
                </div>
              </div>

              <Select
                label="État du bien"
                options={conditions}
                {...register("condition")}
              />

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-2">
                  Équipements & caractéristiques
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

              <Textarea
                label="Description (optionnel)"
                placeholder="Décrivez votre bien en quelques mots..."
                {...register("description")}
              />

              {/* Photos placeholder */}
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-2">
                  Photos
                </label>
                <div className="border-2 border-dashed border-brand-gray-light rounded-xl p-8 text-center hover:border-brand-gray transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 text-brand-gray mx-auto mb-2" />
                  <p className="text-sm text-brand-gray">
                    Glissez vos photos ici ou cliquez pour parcourir
                  </p>
                  <p className="text-xs text-brand-gray mt-1">
                    PNG, JPG jusqu'à 5MB
                  </p>
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

        {/* Step 3: Price & Timing */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Euro className="h-5 w-5 text-brand-primary" />
                Prix & Disponibilité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input
                type="number"
                label="Prix demandé"
                placeholder="345000"
                hint="En euros, sans les centimes"
                {...register("askingPrice", { valueAsNumber: true })}
                error={errors.askingPrice?.message}
              />

              <Select
                label="Timing de vente souhaité"
                options={timings}
                {...register("timing")}
              />

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Disponibilités pour les visites
                </label>
                <textarea
                  value={visitAvailability}
                  onChange={(e) => setVisitAvailability(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border border-brand-gray-light rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none resize-none"
                  placeholder="Ex: Samedi matin, en semaine après 18h..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">
                  <Link2 className="h-4 w-4 inline mr-1" />
                  Lien Immoweb (optionnel)
                </label>
                <input
                  type="url"
                  value={immwebLink}
                  onChange={(e) => setImmwebLink(e.target.value)}
                  className="w-full px-4 py-3 border border-brand-gray-light rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                  placeholder="https://www.immoweb.be/fr/annonce/..."
                />
              </div>

              {/* Agent visibility */}
              <div className="p-4 bg-brand-background rounded-xl">
                <div className="flex items-start gap-4">
                  <button
                    type="button"
                    onClick={() => setAcceptsAgents(!acceptsAgents)}
                    className={cn(
                      "w-12 h-7 rounded-full transition-colors relative flex-shrink-0",
                      acceptsAgents ? "bg-brand-primary" : "bg-brand-gray-light"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow",
                        acceptsAgents ? "left-6" : "left-1"
                      )}
                    />
                  </button>
                  <div>
                    <p className="font-medium text-brand-dark">
                      Visible par les agents immobiliers
                    </p>
                    <p className="text-sm text-brand-gray mt-1">
                      Activez cette option pour permettre aux agents Premium de
                      voir votre bien et de vous proposer leurs services.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing info */}
              <div className="p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/20">
                <h4 className="font-medium text-brand-dark mb-2">
                  Comment ça fonctionne ?
                </h4>
                <ul className="space-y-2 text-sm text-brand-gray">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-brand-secondary flex-shrink-0 mt-0.5" />
                    Encodez votre bien gratuitement
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-brand-secondary flex-shrink-0 mt-0.5" />
                    Voyez le nombre d'acheteurs compatibles
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-brand-secondary flex-shrink-0 mt-0.5" />
                    Payez uniquement pour activer un espace d'échange (79€ par activation)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-brand-secondary flex-shrink-0 mt-0.5" />
                    Garantie réponse sous 7 jours
                  </li>
                </ul>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>
                  Précédent
                </Button>
                <Button type="submit" isLoading={isLoading} size="lg">
                  {saved ? <><CheckCircle className="h-4 w-4 mr-2" />Enregistré !</> : <><Save className="h-4 w-4 mr-2" />Enregistrer le bien</>}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
}
