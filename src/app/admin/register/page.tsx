"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, User, Lock } from "lucide-react";

function AdminRegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }

    fetch(`/api/admin/register?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.email) {
          setEmail(data.email);
          setTokenValid(true);
        } else {
          setError(data.error || "Invitation invalide");
          setTokenValid(false);
        }
      })
      .catch(() => {
        setTokenValid(false);
        setError("Erreur de vérification");
      });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, firstName, lastName, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de l'inscription");
        setIsLoading(false);
        return;
      }

      // Auto-login
      const result = await signIn("admin-password", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/admin/login");
      } else {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch {
      setError("Une erreur est survenue");
      setIsLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-white">Vérification de l'invitation...</div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-modal p-8 max-w-md w-full text-center">
          <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-brand-dark mb-2">Invitation invalide</h1>
          <p className="text-brand-gray mb-6">
            {error || "Cette invitation est invalide, expirée ou a déjà été utilisée."}
          </p>
          <Button onClick={() => router.push("/admin/login")} variant="secondary">
            Retour à la connexion
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image
            src="/logo-immojuste.jpeg"
            alt="ImmoJuste"
            width={180}
            height={50}
            className="h-12 w-auto mx-auto mb-4 rounded"
          />
          <div className="flex items-center justify-center gap-2 text-white/80">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">Inscription administrateur</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-modal p-8">
          <h1 className="text-2xl font-bold text-brand-dark text-center mb-2">
            Créer votre compte
          </h1>
          <p className="text-brand-gray text-center text-sm mb-2">
            Invitation pour <strong>{email}</strong>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm text-center mt-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jean"
                leftIcon={<User className="w-5 h-5" />}
                required
              />
              <Input
                label="Nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Dupont"
                required
              />
            </div>

            <Input
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 caractères"
              leftIcon={<Lock className="w-5 h-5" />}
              required
            />

            <Input
              label="Confirmer le mot de passe"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-5 h-5" />}
              required
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              Créer mon compte admin
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminRegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-dark flex items-center justify-center">
          <div className="text-white">Chargement...</div>
        </div>
      }
    >
      <AdminRegisterContent />
    </Suspense>
  );
}
