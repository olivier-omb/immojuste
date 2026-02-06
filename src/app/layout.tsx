import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "ImmoJuste - L'immobilier commence par l'acheteur",
  description:
    "La première plateforme où les profils d'acheteurs qualifiés deviennent l'actif principal. Vendeurs et agents accèdent à une demande réelle et qualifiée.",
  keywords: [
    "immobilier",
    "acheteur",
    "vendeur",
    "agent immobilier",
    "Belgique",
    "Bruxelles",
  ],
  authors: [{ name: "ImmoJuste" }],
  openGraph: {
    title: "ImmoJuste - L'immobilier commence par l'acheteur",
    description:
      "La première plateforme où les profils d'acheteurs qualifiés deviennent l'actif principal.",
    type: "website",
    locale: "fr_BE",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
