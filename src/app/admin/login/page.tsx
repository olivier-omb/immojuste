"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, Mail, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("admin-password", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou mot de passe incorrect");
      } else {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch {
      setError("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

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
            <span className="text-sm font-medium">Administration</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-modal p-8">
          <h1 className="text-2xl font-bold text-brand-dark text-center mb-2">
            Connexion admin
          </h1>
          <p className="text-brand-gray text-center text-sm mb-8">
            Accédez au panneau d'administration
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@immojuste.be"
              leftIcon={<Mail className="w-5 h-5" />}
              required
            />

            <Input
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              Se connecter
            </Button>
          </form>
        </div>

        <p className="text-white/40 text-center text-xs mt-6">
          ImmoJuste — Plateforme technologique de matching immobilier
        </p>
      </div>
    </div>
  );
}
