"use client";

import { useState, useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";

interface SecureAccessSheetProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
  callbackUrl?: string;
}

export function SecureAccessSheet({
  isOpen,
  onClose,
  defaultEmail = "",
  callbackUrl = "/dashboard",
}: SecureAccessSheetProps) {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState(defaultEmail);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (defaultEmail) setEmail(defaultEmail);
  }, [defaultEmail]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep("email");
      setCode("");
      setError(null);
      setIsLoading(false);
      setResendTimer(0);
    }
  }, [isOpen]);

  const handleSendCode = async () => {
    if (!email) {
      setError("Veuillez entrer votre email");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi du code");
      }

      setStep("code");
      setResendTimer(30);
      setCode("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      setError("Veuillez entrer le code à 6 chiffres");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Sign in via NextAuth OTP provider
      const result = await signIn("otp", {
        email,
        code,
        redirect: false,
      });

      if (result?.error) {
        setError("Code invalide ou expiré");
        setCode("");
        return;
      }

      onClose();
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeInput = (value: string, index: number) => {
    const newCode = code.split("");
    newCode[index] = value;
    const updated = newCode.join("").slice(0, 6);
    setCode(updated);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    setCode(pasted);
    if (pasted.length === 6) {
      inputRefs.current[5]?.focus();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
      <div className="text-center space-y-6">
        {/* Icon */}
        <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldCheck className="h-8 w-8 text-brand-primary" />
        </div>

        {step === "email" ? (
          <>
            <div>
              <h2 className="text-xl font-bold text-brand-dark">Connexion sécurisée</h2>
              <p className="text-brand-gray mt-2 text-sm">
                Entrez votre email pour recevoir un code de vérification
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-gray" />
              <Input
                type="email"
                placeholder="votre@email.com"
                className="pl-12 text-center"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
                autoFocus
              />
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleSendCode}
              isLoading={isLoading}
            >
              Envoyer le code
            </Button>
          </>
        ) : (
          <>
            <div>
              <h2 className="text-xl font-bold text-brand-dark">Vérification</h2>
              <p className="text-brand-gray mt-2 text-sm">
                Entrez le code à 6 chiffres envoyé à <strong>{email}</strong>
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* 6-digit code input */}
            <div className="flex justify-center gap-2" onPaste={handlePaste}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={code[i] || ""}
                  onChange={(e) => handleCodeInput(e.target.value.replace(/\D/g, ""), i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="w-12 h-14 text-center text-xl font-bold border-2 border-brand-gray-light rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-colors"
                  autoFocus={i === 0}
                />
              ))}
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleVerifyCode}
              isLoading={isLoading}
              disabled={code.length !== 6}
            >
              Valider
            </Button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setCode("");
                  setError(null);
                }}
                className="text-brand-gray hover:text-brand-dark flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                Changer d'email
              </button>

              {resendTimer > 0 ? (
                <span className="text-brand-gray">
                  Renvoyer dans {resendTimer}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendCode}
                  className="text-brand-primary hover:underline"
                  disabled={isLoading}
                >
                  Renvoyer le code
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
