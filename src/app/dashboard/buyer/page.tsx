"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, StatCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress, CircularProgress } from "@/components/ui/progress";
import {
  User,
  Home,
  Eye,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Loader2,
  Sparkles,
  Target,
  Bell,
  Star,
} from "lucide-react";

interface BuyerProfile {
  id: string;
  budgetMin: number;
  budgetMax: number;
  financingStatus: string;
  timing: string;
  propertyTypes: string[];
  qualificationScore: number;
  badges: string[];
  isComplete: boolean;
  zones: { commune: string }[];
}

interface Match {
  id: string;
  compatibilityScore: number;
  compatibilityGrade: string;
  sellerUnlocked: boolean;
}

export default function BuyerDashboard() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<BuyerProfile | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [profileRes, matchesRes] = await Promise.all([
          fetch("/api/buyers/profile"),
          fetch("/api/matches"),
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
        }

        if (matchesRes.ok) {
          const matchesData = await matchesRes.json();
          setMatches(matchesData);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Calculate profile completion
  const calculateCompletion = () => {
    if (!profile) return 0;
    let score = 20; // Base score for having a profile

    if (profile.budgetMax > 0) score += 20;
    if (profile.zones?.length > 0) score += 20;
    if (profile.propertyTypes?.length > 0) score += 20;
    if (profile.financingStatus !== "NOT_STARTED") score += 20;

    return score;
  };

  const profileCompletion = calculateCompletion();

  const stats = {
    views: 0, // TODO: implement view tracking
    matches: matches.length,
    interested: matches.filter((m) => m.sellerUnlocked).length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-brand-primary mx-auto mb-4" />
          <p className="text-brand-gray">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-brand-gray-light/50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl md:text-3xl font-bold text-brand-dark">
              Bonjour {session?.user?.name?.split(" ")[0] || ""}
            </h1>
            <span className="text-2xl">👋</span>
          </div>
          <p className="text-brand-gray">
            Bienvenue sur votre espace acheteur. Voici un résumé de votre activité.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Link href="/dashboard/buyer/profile">
            <Button className="group">
              {profile?.isComplete ? "Modifier" : "Compléter"} mon profil
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile completion alert */}
      {profileCompletion < 80 && (
        <Card className="border-brand-accent/30 bg-gradient-to-r from-brand-accent/5 to-transparent overflow-hidden">
          <CardContent className="flex flex-col md:flex-row items-start md:items-center gap-4 p-5">
            <div className="w-14 h-14 bg-brand-accent/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-7 w-7 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-brand-dark text-lg mb-1">
                Complétez votre profil pour être visible
              </p>
              <p className="text-sm text-brand-gray mb-3">
                Un profil complet augmente vos chances d'être contacté par des
                vendeurs sérieux. Vous êtes à {profileCompletion}% !
              </p>
              <Progress value={profileCompletion} variant="warning" size="md" className="max-w-md" />
            </div>
            <Link href="/dashboard/buyer/profile">
              <Button className="whitespace-nowrap">
                Compléter maintenant
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          value={profile?.qualificationScore || 0}
          label="Score de qualification"
          icon={<Star className="h-5 w-5" />}
          trend={profileCompletion >= 80 ? { value: 15, isPositive: true } : undefined}
        />

        <StatCard
          value={stats.matches}
          label="Biens compatibles"
          icon={<Home className="h-5 w-5" />}
        />

        <StatCard
          value={stats.interested}
          label="Vendeurs intéressés"
          icon={<TrendingUp className="h-5 w-5" />}
        />

        <StatCard
          value={`${profileCompletion}%`}
          label="Profil complété"
          icon={<Target className="h-5 w-5" />}
        />
      </div>

      {/* Profile summary & Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Profile summary */}
        <Card variant="outline" className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-brand-background to-white border-b border-brand-gray-light/30">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                <User className="h-4 w-4 text-brand-primary" />
              </div>
              Mon profil
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center gap-6 mb-6">
              <CircularProgress
                value={profileCompletion}
                variant={profileCompletion >= 80 ? "success" : profileCompletion >= 60 ? "warning" : "default"}
                size={80}
              />
              <div>
                <Badge
                  variant={
                    profileCompletion >= 80
                      ? "grade_a"
                      : profileCompletion >= 60
                      ? "grade_b"
                      : "grade_c"
                  }
                  size="sm"
                  className="mb-2"
                >
                  {profileCompletion >= 80
                    ? "Profil complet"
                    : profileCompletion >= 60
                    ? "En bonne voie"
                    : "À compléter"}
                </Badge>
                <p className="text-sm text-brand-gray">
                  {profileCompletion >= 80
                    ? "Votre profil est optimisé pour attirer des vendeurs"
                    : "Complétez votre profil pour plus de visibilité"}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { done: true, label: "Informations de base" },
                { done: profile && profile.budgetMax > 0, label: "Budget défini" },
                { done: profile && profile.zones?.length > 0, label: "Zones de recherche" },
                { done: profile && profile.financingStatus !== "NOT_STARTED", label: "Financement renseigné" },
                { done: profile && profile.propertyTypes?.length > 0, label: "Critères détaillés" },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  item.done ? "bg-brand-secondary/5" : "bg-brand-background"
                }`}>
                  {item.done ? (
                    <div className="w-6 h-6 rounded-full bg-brand-secondary/20 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-brand-secondary" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-brand-gray-light" />
                  )}
                  <span className={`text-sm ${item.done ? "text-brand-dark font-medium" : "text-brand-gray"}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <Link href="/dashboard/buyer/profile" className="block">
              <Button className="w-full group">
                Modifier mon profil
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Matches or Tips */}
        {matches.length > 0 ? (
          <Card variant="outline" className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-brand-secondary/5 to-white border-b border-brand-gray-light/30">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-brand-secondary/10 rounded-lg flex items-center justify-center">
                    <Home className="h-4 w-4 text-brand-secondary" />
                  </div>
                  Vos matches récents
                </span>
                <Badge variant="success" size="sm">{matches.length} total</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {matches.slice(0, 3).map((match) => (
                  <div
                    key={match.id}
                    className="p-4 bg-white border border-brand-gray-light/50 rounded-2xl flex items-center justify-between hover:border-brand-primary/30 hover:shadow-card transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={
                          match.compatibilityGrade === "A"
                            ? "grade_a"
                            : match.compatibilityGrade === "B"
                            ? "grade_b"
                            : "grade_c"
                        }
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-base"
                      >
                        {match.compatibilityGrade}
                      </Badge>
                      <div>
                        <p className="font-semibold text-brand-dark">
                          {match.compatibilityScore}% compatible
                        </p>
                        <p className="text-sm text-brand-gray">
                          {match.sellerUnlocked
                            ? "Vendeur intéressé"
                            : "En attente de contact"}
                        </p>
                      </div>
                    </div>
                    {match.sellerUnlocked && (
                      <Badge variant="success" size="sm" icon={<CheckCircle className="w-3 h-3" />}>
                        Contact dispo
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
              {matches.length > 3 && (
                <Button variant="ghost" className="w-full mt-4">
                  Voir tous les matches (+{matches.length - 3})
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card variant="outline" className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-brand-primary/5 to-white border-b border-brand-gray-light/30">
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-brand-primary" />
                </div>
                Conseils pour maximiser vos chances
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[
                  {
                    icon: "💰",
                    title: "Complétez votre financement",
                    desc: "Un acheteur avec un financement pré-approuvé est 3x plus susceptible d'être contacté."
                  },
                  {
                    icon: "📍",
                    title: "Soyez précis sur vos zones",
                    desc: "Plus vos zones sont précises, plus les matches seront pertinents."
                  },
                  {
                    icon: "🚫",
                    title: "Définissez vos dealbreakers",
                    desc: "Indiquez clairement ce que vous ne voulez pas pour éviter les propositions non pertinentes."
                  }
                ].map((tip, i) => (
                  <div key={i} className="p-4 bg-brand-background rounded-2xl hover:bg-brand-primary/5 transition-colors">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{tip.icon}</span>
                      <div>
                        <p className="font-semibold text-brand-dark mb-1">
                          {tip.title}
                        </p>
                        <p className="text-sm text-brand-gray leading-relaxed">
                          {tip.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
