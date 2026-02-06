import { z } from "zod";
import { safeNum, safeNumOptional } from "./zod-helpers";

export const buyerOnboardingSchema = z.object({
  // Step 1: Infos perso
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(1, "Téléphone requis"),

  // Step 2: Critères
  budgetMin: safeNum(0, "Budget minimum requis"),
  budgetMax: safeNum(1, "Budget maximum requis"),
  propertyTypes: z.array(z.string()).min(1, "Sélectionnez au moins un type"),
  zones: z.array(z.object({
    commune: z.string(),
    postalCode: z.string(),
  })).min(1, "Sélectionnez au moins une zone"),
  minBedrooms: safeNumOptional(),
  minSurface: safeNumOptional(),

  // Step 3: Timing & financement
  timing: z.string(),
  financingStatus: z.string(),

  // Step 4: Préférences & consentements
  mustHave: z.array(z.string()).optional(),
  dealbreakers: z.array(z.string()).optional(),
  consentTerms: z.boolean().refine((v) => v, "Vous devez accepter les conditions"),
  consentPrivacy: z.boolean().refine((v) => v, "Vous devez accepter la politique de confidentialité"),
  consentMarketing: z.boolean().optional(),
});

export const sellerOnboardingSchema = z.object({
  // Step 1: Infos perso
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(1, "Téléphone requis"),

  // Step 2: Bien
  propertyType: z.string().min(1, "Type de bien requis"),
  commune: z.string().min(1, "Commune requise"),
  postalCode: z.string().min(1, "Code postal requis"),
  surface: safeNum(1, "Surface requise"),
  bedrooms: safeNum(0, "Nombre de chambres requis"),
  bathrooms: safeNum(0, "Nombre de salles de bain requis"),
  condition: z.string(),

  // Step 3: Prix & dispo
  askingPrice: safeNum(1, "Prix demandé requis"),
  priceNegotiable: z.boolean(),
  visitAvailability: z.string().optional(),
  timing: z.string(),
  immwebLink: z.string().optional(),

  // Step 4: Caractéristiques & consentements
  features: z.array(z.string()).optional(),
  consentTerms: z.boolean().refine((v) => v, "Vous devez accepter les conditions"),
  consentPrivacy: z.boolean().refine((v) => v, "Vous devez accepter la politique de confidentialité"),
  consentMarketing: z.boolean().optional(),
});

export const agentOnboardingSchema = z.object({
  // Step 1: Infos perso + agence
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(1, "Téléphone requis"),
  agencyName: z.string().min(1, "Nom d'agence requis"),
  ipiNumber: z.string().min(1, "Numéro IPI requis"),

  // Step 2: Zones & spécialités
  zones: z.array(z.string()).min(1, "Sélectionnez au moins une zone"),
  specialties: z.array(z.string()).optional(),

  // Step 3: Consentements
  consentTerms: z.boolean().refine((v) => v, "Vous devez accepter les conditions"),
  consentPrivacy: z.boolean().refine((v) => v, "Vous devez accepter la politique de confidentialité"),
  consentMarketing: z.boolean().optional(),
});

export type BuyerOnboardingData = z.infer<typeof buyerOnboardingSchema>;
export type SellerOnboardingData = z.infer<typeof sellerOnboardingSchema>;
export type AgentOnboardingData = z.infer<typeof agentOnboardingSchema>;
