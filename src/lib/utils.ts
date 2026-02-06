import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-BE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function getInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.charAt(0).toUpperCase() || "";
  const last = lastName?.charAt(0).toUpperCase() || "";
  return first + last || "?";
}

export function getTimingLabel(timing: string): string {
  const labels: Record<string, string> = {
    URGENT: "0-3 mois",
    SHORT_TERM: "3-6 mois",
    MEDIUM_TERM: "6-12 mois",
    FLEXIBLE: "12+ mois",
  };
  return labels[timing] || timing;
}

export function getFinancingLabel(status: string): string {
  const labels: Record<string, string> = {
    NOT_STARTED: "Non commencé",
    SIMULATED: "Simulation faite",
    PRE_APPROVED: "Pré-approuvé",
    APPROVED: "Approuvé",
    CASH: "Comptant",
  };
  return labels[status] || status;
}

export function getPropertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    APARTMENT: "Appartement",
    HOUSE: "Maison",
    STUDIO: "Studio",
    LOFT: "Loft",
    VILLA: "Villa",
    DUPLEX: "Duplex",
    PENTHOUSE: "Penthouse",
    OTHER: "Autre",
  };
  return labels[type] || type;
}

export function getConditionLabel(condition: string): string {
  const labels: Record<string, string> = {
    NEW: "Neuf",
    EXCELLENT: "Excellent état",
    GOOD: "Bon état",
    TO_REFRESH: "À rafraîchir",
    TO_RENOVATE: "À rénover",
  };
  return labels[condition] || condition;
}

export function calculateQualificationScore(profile: {
  budgetMax: number;
  financingStatus: string;
  timing: string;
  zones?: { length: number };
  isVerified?: boolean;
}): number {
  let score = 0;

  // Budget filled (20 points)
  if (profile.budgetMax > 0) score += 20;

  // Financing status (30 points max)
  const financingScores: Record<string, number> = {
    NOT_STARTED: 5,
    SIMULATED: 15,
    PRE_APPROVED: 25,
    APPROVED: 30,
    CASH: 30,
  };
  score += financingScores[profile.financingStatus] || 0;

  // Timing (20 points max)
  const timingScores: Record<string, number> = {
    URGENT: 20,
    SHORT_TERM: 15,
    MEDIUM_TERM: 10,
    FLEXIBLE: 5,
  };
  score += timingScores[profile.timing] || 0;

  // Zones defined (15 points)
  if (profile.zones && profile.zones.length > 0) score += 15;

  // Verified profile (15 points)
  if (profile.isVerified) score += 15;

  return Math.min(100, score);
}

export function getScoreBadge(score: number): { label: string; color: string } {
  if (score >= 80) return { label: "Excellent", color: "bg-green-500" };
  if (score >= 60) return { label: "Bon", color: "bg-blue-500" };
  if (score >= 40) return { label: "Moyen", color: "bg-yellow-500" };
  return { label: "À compléter", color: "bg-gray-400" };
}
