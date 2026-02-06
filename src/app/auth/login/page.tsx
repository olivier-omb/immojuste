"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SecureAccessSheet } from "@/components/auth/secure-access-sheet";

export default function LoginPage() {
  const [showOtp, setShowOtp] = useState(true);

  return (
    <div className="min-h-screen bg-brand-background flex">
      {/* Left side */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center text-brand-gray hover:text-brand-dark transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>

          <div className="bg-white rounded-2xl shadow-card p-8 text-center">
            <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">IJ</span>
            </div>
            <h1 className="text-2xl font-bold text-brand-dark">Connexion</h1>
            <p className="text-brand-gray mt-2 mb-6">
              Accédez à votre espace ImmoJuste
            </p>

            <Button
              className="w-full"
              size="lg"
              onClick={() => setShowOtp(true)}
            >
              Se connecter par email
            </Button>

            <div className="mt-6">
              <p className="text-brand-gray text-sm">
                Pas encore de compte ?{" "}
                <Link
                  href="/onboarding/acheteur"
                  className="text-brand-primary font-medium hover:underline"
                >
                  S'inscrire
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-brand-primary to-brand-primary-dark items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <h2 className="text-4xl font-bold mb-6">
            L'immobilier commence par l'acheteur
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Connectez-vous pour accéder à votre espace et gérer vos matches,
            vos contacts et vos opportunités.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white">✓</span>
              </div>
              <span>Connexion sécurisée par code email</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white">✓</span>
              </div>
              <span>Pas de mot de passe à retenir</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white">✓</span>
              </div>
              <span>Accès instantané à votre dashboard</span>
            </div>
          </div>
        </div>
      </div>

      <SecureAccessSheet
        isOpen={showOtp}
        onClose={() => setShowOtp(false)}
      />
    </div>
  );
}
