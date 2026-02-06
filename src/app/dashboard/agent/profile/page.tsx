"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentProfile {
  id: string;
  agencyName: string;
  licenseNumber: string;
  phone: string;
  website: string;
  bio: string;
  zones: string[];
  specialties: string[];
}

export default function AgentProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<AgentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [agencyName, setAgencyName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");
  const [zonesInput, setZonesInput] = useState("");
  const [specialtiesInput, setSpecialtiesInput] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/agents/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setAgencyName(data.agencyName || "");
          setLicenseNumber(data.ipiNumber || data.licenseNumber || "");
          setPhone(data.phone || "");
          setWebsite(data.website || "");
          setBio(data.bio || "");
          setZonesInput(data.zones?.join(", ") || "");
          setSpecialtiesInput(data.specialties?.join(", ") || "");
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!licenseNumber.trim()) {
      setError("Le numéro IPI est obligatoire");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/agents/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agencyName,
          ipiNumber: licenseNumber,
          phone,
          website,
          bio,
          zones: zonesInput.split(",").map((z) => z.trim()).filter(Boolean),
          specialties: specialtiesInput.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la sauvegarde");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-brand-dark">
          Mon profil agent
        </h1>
        <p className="text-brand-gray mt-1">
          Gérez vos informations professionnelles
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          Profil sauvegardé avec succès
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Agency info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-brand-primary" />
              Informations agence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">
                Nom de l'agence
              </label>
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className="w-full px-4 py-3 border border-brand-gray-light rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                placeholder="Nom de votre agence"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">
                Numéro IPI *
              </label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className={cn(
                  "w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none",
                  !licenseNumber ? "border-red-300" : "border-brand-gray-light"
                )}
                placeholder="IPI XXXXXX"
                required
              />
              <p className="text-xs text-brand-gray mt-1">Numéro d'agréation IPI obligatoire</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">
                Bio / Description
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-brand-gray-light rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none resize-none"
                placeholder="Décrivez votre activité et votre expertise..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-brand-primary" />
              Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">
                Email
              </label>
              <input
                type="email"
                value={session?.user?.email || ""}
                disabled
                className="w-full px-4 py-3 border border-brand-gray-light rounded-xl bg-brand-background text-brand-gray"
              />
              <p className="text-xs text-brand-gray mt-1">L'email ne peut pas être modifié ici</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-brand-gray-light rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                placeholder="+32 xxx xx xx xx"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">
                Site web
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-4 py-3 border border-brand-gray-light rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                placeholder="https://www.monagence.be"
              />
            </div>
          </CardContent>
        </Card>

        {/* Zones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-brand-primary" />
              Zones d'activité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">
                Communes (séparées par des virgules)
              </label>
              <textarea
                value={zonesInput}
                onChange={(e) => setZonesInput(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-brand-gray-light rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none resize-none"
                placeholder="Ixelles, Saint-Gilles, Uccle, Forest..."
              />
              <p className="text-xs text-brand-gray mt-1">
                Vous recevrez des leads d'acheteurs recherchant dans ces zones
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">
                Spécialités (séparées par des virgules)
              </label>
              <textarea
                value={specialtiesInput}
                onChange={(e) => setSpecialtiesInput(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border border-brand-gray-light rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none resize-none"
                placeholder="Appartements, Maisons, Investissement, Neuf..."
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Sauvegarder le profil
        </Button>
      </div>
    </div>
  );
}
