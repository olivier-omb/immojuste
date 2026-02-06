"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/onboarding/acheteur");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-background">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary" />
    </div>
  );
}
