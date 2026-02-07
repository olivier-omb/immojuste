"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { User, Phone, Calendar, Link2, Save, CheckCircle } from "lucide-react";

export default function SellerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [phone, setPhone] = useState("");
  const [visitAvailability, setVisitAvailability] = useState("");
  const [immwebLink, setImmwebLink] = useState("");
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);

  useEffect(() => {
    fetch("/api/sellers/profile")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) {
          setPhone(data.phone || "");
          setVisitAvailability(data.visitAvailability || "");
          setImmwebLink(data.immwebLink || "");
          setConsentTerms(data.consentTerms || false);
          setConsentPrivacy(data.consentPrivacy || false);
          setConsentMarketing(data.consentMarketing || false);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch("/api/sellers/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          visitAvailability,
          immwebLink,
          consentTerms,
          consentPrivacy,
          consentMarketing,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur lors de la sauvegarde");
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      setError("Une erreur est survenue");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="h-64 bg-white rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">Mon profil</h1>
        <p className="text-brand-gray text-sm mt-1">
          Mettez à jour vos informations personnelles
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Profil sauvegardé avec succès
        </div>
      )}

      {/* Contact */}
      <Card className="border-0 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Phone className="w-5 h-5 text-brand-primary" />
            Contact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            label="Numéro de téléphone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+32 470 12 34 56"
            leftIcon={<Phone className="w-5 h-5" />}
          />
        </CardContent>
      </Card>

      {/* Disponibilités */}
      <Card className="border-0 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5 text-brand-primary" />
            Disponibilités
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            label="Disponibilités pour les visites"
            value={visitAvailability}
            onChange={(e) => setVisitAvailability(e.target.value)}
            placeholder="Ex: Du lundi au vendredi, 9h-18h. Samedi sur rendez-vous."
          />
          <Input
            label="Lien Immoweb (optionnel)"
            type="url"
            value={immwebLink}
            onChange={(e) => setImmwebLink(e.target.value)}
            placeholder="https://www.immoweb.be/..."
            leftIcon={<Link2 className="w-5 h-5" />}
          />
        </CardContent>
      </Card>

      {/* Consentements */}
      <Card className="border-0 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="w-5 h-5 text-brand-primary" />
            Consentements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Checkbox
            label="J'accepte les conditions générales d'utilisation"
            checked={consentTerms}
            onChange={(e) => setConsentTerms(e.target.checked)}
          />
          <Checkbox
            label="J'accepte la politique de confidentialité"
            checked={consentPrivacy}
            onChange={(e) => setConsentPrivacy(e.target.checked)}
          />
          <Checkbox
            label="J'accepte de recevoir des communications marketing"
            checked={consentMarketing}
            onChange={(e) => setConsentMarketing(e.target.checked)}
          />
        </CardContent>
      </Card>

      <Button
        onClick={handleSave}
        isLoading={saving}
        size="lg"
        className="w-full"
        leftIcon={<Save className="w-5 h-5" />}
      >
        Sauvegarder
      </Button>
    </div>
  );
}
