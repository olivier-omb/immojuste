import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Home,
  Briefcase,
  CheckCircle,
  ArrowRight,
  Shield,
  Zap,
  Users,
  TrendingUp,
  MapPin,
  Euro,
  Clock,
  Star,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-background via-white to-brand-primary/5" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-brand-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-brand-secondary/10 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: Content */}
              <div className="text-center lg:text-left">
                <Badge variant="new" className="mb-6 inline-flex">
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  Nouveau en Belgique
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-display-md font-bold text-brand-dark leading-tight">
                  L'immobilier commence par{" "}
                  <span className="text-brand-primary bg-gradient-to-r from-brand-primary to-brand-primary-dark bg-clip-text">
                    l'acheteur
                  </span>
                </h1>
                <p className="mt-6 text-lg lg:text-xl text-brand-gray max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  La première plateforme où les profils d'acheteurs qualifiés
                  deviennent l'actif principal. Vendeurs et agents accèdent à une
                  demande réelle et vérifiée.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/onboarding/acheteur">
                    <Button size="xl" className="w-full sm:w-auto group">
                      Je suis acheteur
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/onboarding/vendeur">
                    <Button size="xl" variant="outline" className="w-full sm:w-auto">
                      Je suis vendeur
                    </Button>
                  </Link>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-brand-gray">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-brand-secondary" />
                    Gratuit pour les acheteurs
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-brand-secondary" />
                    0% commission
                  </span>
                </div>
              </div>

              {/* Right: Floating Buyer Card */}
              <div className="relative hidden lg:block">
                <div className="absolute -top-8 -left-8 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-brand-secondary/10 rounded-full blur-2xl" />

                {/* Main buyer card */}
                <div className="relative bg-white rounded-3xl shadow-card-elevated p-6 transform hover:scale-[1.02] transition-transform duration-300">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-button">
                      <span className="text-white font-bold text-lg">MD</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-brand-dark text-lg">
                        Marie D.
                      </p>
                      <p className="text-sm text-brand-gray flex items-center gap-1">
                        <Star className="w-4 h-4 text-brand-accent fill-brand-accent" />
                        Acheteuse vérifiée
                      </p>
                    </div>
                    <div className="bg-brand-secondary/10 text-brand-secondary text-sm font-bold px-4 py-2 rounded-full">
                      Score: 92
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-brand-background rounded-xl">
                      <Euro className="w-5 h-5 text-brand-primary" />
                      <div>
                        <p className="text-xs text-brand-gray">Budget</p>
                        <p className="font-semibold text-brand-dark">350.000 - 420.000 €</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-brand-background rounded-xl">
                      <MapPin className="w-5 h-5 text-brand-primary" />
                      <div>
                        <p className="text-xs text-brand-gray">Zones recherchées</p>
                        <p className="font-semibold text-brand-dark">Ixelles, Uccle, Forest</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-brand-background rounded-xl">
                      <Clock className="w-5 h-5 text-brand-primary" />
                      <div>
                        <p className="text-xs text-brand-gray">Timing</p>
                        <p className="font-semibold text-brand-dark">Prêt à acheter sous 3 mois</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-5 border-t border-brand-gray-light/50 flex flex-wrap gap-2">
                    <span className="bg-brand-primary/10 text-brand-primary text-xs font-medium px-3 py-1.5 rounded-full">
                      3+ chambres
                    </span>
                    <span className="bg-brand-primary/10 text-brand-primary text-xs font-medium px-3 py-1.5 rounded-full">
                      Terrasse
                    </span>
                    <span className="bg-brand-primary/10 text-brand-primary text-xs font-medium px-3 py-1.5 rounded-full">
                      Garage
                    </span>
                    <span className="bg-brand-secondary/10 text-brand-secondary text-xs font-medium px-3 py-1.5 rounded-full">
                      Financement confirmé
                    </span>
                  </div>
                </div>

                {/* Floating notification */}
                <div className="absolute -bottom-12 -left-6 bg-white rounded-2xl shadow-card p-4 animate-float z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-secondary/10 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-brand-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-brand-dark">Nouveau match!</p>
                      <p className="text-xs text-brand-gray">Il y a 2 minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="muted" className="mb-4">Comment ça marche</Badge>
              <h2 className="text-3xl md:text-4xl lg:text-display-sm font-bold text-brand-dark">
                Trois étapes vers le succès
              </h2>
              <p className="mt-4 text-lg text-brand-gray max-w-2xl mx-auto">
                Un processus simple et transparent pour connecter acheteurs et vendeurs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connection line */}
              <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary" />

              {/* Step 1 */}
              <div className="relative text-center p-8 rounded-3xl bg-white border border-brand-gray-light/50 hover:border-brand-primary/30 hover:shadow-card-hover transition-all duration-300 group">
                <div className="w-12 h-12 bg-brand-primary text-white rounded-xl flex items-center justify-center mx-auto mb-6 font-bold text-lg shadow-button group-hover:scale-110 transition-transform">
                  1
                </div>
                <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-brand-primary/20 transition-colors">
                  <Search className="h-8 w-8 text-brand-primary" />
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-3">
                  Créez votre profil acheteur
                </h3>
                <p className="text-brand-gray leading-relaxed">
                  Budget, zones, timing, financement. Votre profil qualifié vous rend
                  visible auprès des vendeurs sérieux.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative text-center p-8 rounded-3xl bg-white border border-brand-gray-light/50 hover:border-brand-secondary/30 hover:shadow-card-hover transition-all duration-300 group">
                <div className="w-12 h-12 bg-brand-secondary text-white rounded-xl flex items-center justify-center mx-auto mb-6 font-bold text-lg shadow-md group-hover:scale-110 transition-transform">
                  2
                </div>
                <div className="w-16 h-16 bg-brand-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-brand-secondary/20 transition-colors">
                  <Home className="h-8 w-8 text-brand-secondary" />
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-3">
                  Vendeurs testent leur bien
                </h3>
                <p className="text-brand-gray leading-relaxed">
                  Encodez votre bien et voyez combien d'acheteurs qualifiés
                  correspondent. Sans engagement.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative text-center p-8 rounded-3xl bg-white border border-brand-gray-light/50 hover:border-brand-primary/30 hover:shadow-card-hover transition-all duration-300 group">
                <div className="w-12 h-12 bg-brand-primary text-white rounded-xl flex items-center justify-center mx-auto mb-6 font-bold text-lg shadow-button group-hover:scale-110 transition-transform">
                  3
                </div>
                <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-brand-primary/20 transition-colors">
                  <Zap className="h-8 w-8 text-brand-primary" />
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-3">
                  Matching intelligent
                </h3>
                <p className="text-brand-gray leading-relaxed">
                  Notre algorithme connecte les profils compatibles. Payez uniquement pour
                  des contacts qualifiés.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* User Types */}
        <section className="py-24 bg-gradient-to-b from-brand-background to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="muted" className="mb-4">Pour tous les acteurs</Badge>
              <h2 className="text-3xl md:text-4xl lg:text-display-sm font-bold text-brand-dark">
                Une solution pour chacun
              </h2>
              <p className="mt-4 text-lg text-brand-gray max-w-2xl mx-auto">
                Que vous cherchiez, vendiez ou accompagniez, ImmoJuste vous connecte efficacement
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Acheteur */}
              <div className="relative bg-white rounded-3xl p-8 shadow-card hover:shadow-card-elevated transition-all duration-300 border border-transparent hover:border-brand-primary/20 group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6 shadow-button group-hover:scale-110 transition-transform">
                    <Search className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-dark mb-2">
                    Acheteurs
                  </h3>
                  <Badge variant="success" size="sm" className="mb-5">
                    100% Gratuit
                  </Badge>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3.5 w-3.5 text-brand-secondary" />
                      </div>
                      <span className="text-brand-gray">
                        Devenez visible auprès des vendeurs sérieux
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3.5 w-3.5 text-brand-secondary" />
                      </div>
                      <span className="text-brand-gray">
                        Recevez des opportunités pertinentes
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3.5 w-3.5 text-brand-secondary" />
                      </div>
                      <span className="text-brand-gray">
                        Prouvez votre sérieux avec votre score
                      </span>
                    </li>
                  </ul>
                  <Link href="/acheteur">
                    <Button className="w-full group/btn">
                      Créer mon profil
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Vendeur - Featured */}
              <div className="relative bg-brand-dark rounded-3xl p-8 shadow-card-elevated transition-all duration-300 group overflow-hidden md:-mt-4 md:mb-4">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary" />
                <div className="absolute top-0 right-0 w-40 h-40 bg-brand-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                <div className="relative">
                  <Badge variant="highlight" size="sm" className="mb-6">
                    Populaire
                  </Badge>
                  <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-white/20">
                    <Home className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Vendeurs
                  </h3>
                  <Badge variant="info" size="sm" className="mb-5">
                    Payez au résultat
                  </Badge>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3.5 w-3.5 text-brand-secondary" />
                      </div>
                      <span className="text-gray-300">
                        Testez votre bien gratuitement
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3.5 w-3.5 text-brand-secondary" />
                      </div>
                      <span className="text-gray-300">
                        Accédez à des acheteurs vérifiés
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3.5 w-3.5 text-brand-secondary" />
                      </div>
                      <span className="text-gray-300">
                        Zéro commission sur la vente
                      </span>
                    </li>
                  </ul>
                  <Link href="/vendeur">
                    <Button variant="white" className="w-full group/btn">
                      Tester mon bien
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Agent */}
              <div className="relative bg-white rounded-3xl p-8 shadow-card hover:shadow-card-elevated transition-all duration-300 border border-transparent hover:border-brand-secondary/20 group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-dark rounded-2xl flex items-center justify-center mb-6 shadow-card group-hover:scale-110 transition-transform">
                    <Briefcase className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-dark mb-2">
                    Agents
                  </h3>
                  <Badge variant="muted" size="sm" className="mb-5">
                    Abonnement mensuel
                  </Badge>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3.5 w-3.5 text-brand-secondary" />
                      </div>
                      <span className="text-brand-gray">
                        Accédez à la demande qualifiée
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3.5 w-3.5 text-brand-secondary" />
                      </div>
                      <span className="text-brand-gray">
                        Convertissez plus vite en mandats
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3.5 w-3.5 text-brand-secondary" />
                      </div>
                      <span className="text-brand-gray">
                        ROI mesurable et transparent
                      </span>
                    </li>
                  </ul>
                  <Link href="/agent">
                    <Button variant="secondary" className="w-full group/btn">
                      Voir les offres
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <Badge variant="muted" className="mb-4">Confiance & Sécurité</Badge>
                <h2 className="text-3xl md:text-4xl lg:text-display-sm font-bold text-brand-dark mb-6">
                  La qualité prime sur la quantité
                </h2>
                <p className="text-lg text-brand-gray mb-10 leading-relaxed">
                  ImmoJuste n'est pas un site d'annonces de plus. C'est une
                  plateforme où chaque connexion compte.
                </p>
                <div className="space-y-8">
                  <div className="flex gap-5 group">
                    <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-brand-primary/20 transition-colors">
                      <Shield className="h-7 w-7 text-brand-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-dark mb-1.5 text-lg">
                        Profils vérifiés
                      </h4>
                      <p className="text-brand-gray leading-relaxed">
                        Score de qualification, badges de confiance, vérification du financement bancaire
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-5 group">
                    <div className="w-14 h-14 bg-brand-secondary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-brand-secondary/20 transition-colors">
                      <Zap className="h-7 w-7 text-brand-secondary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-dark mb-1.5 text-lg">
                        Matching intelligent
                      </h4>
                      <p className="text-brand-gray leading-relaxed">
                        Algorithme basé sur la compatibilité réelle, pas sur le volume ou les enchères
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-5 group">
                    <div className="w-14 h-14 bg-brand-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-brand-accent/20 transition-colors">
                      <Users className="h-7 w-7 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-dark mb-1.5 text-lg">
                        Protection anti-spam
                      </h4>
                      <p className="text-brand-gray leading-relaxed">
                        Quotas de contact, anonymisation par défaut, révélation progressive des informations
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual element */}
              <div className="relative">
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-primary/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-brand-secondary/5 rounded-full blur-2xl" />

                <div className="relative">
                  {/* Trust badges */}
                  <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-card p-4 z-10 animate-float">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-secondary/10 rounded-xl flex items-center justify-center">
                        <Shield className="w-5 h-5 text-brand-secondary" />
                      </div>
                      <div>
                        <p className="text-xs text-brand-gray">Profil vérifié</p>
                        <p className="font-bold text-brand-secondary">100%</p>
                      </div>
                    </div>
                  </div>

                  {/* Main card */}
                  <div className="bg-gradient-to-br from-brand-background to-white rounded-3xl p-8 shadow-card-elevated">
                    <div className="bg-white rounded-2xl shadow-card p-6">
                      <div className="flex items-center gap-4 mb-5">
                        <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-button">
                          <span className="text-white font-bold text-lg">JD</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-brand-dark text-lg">Jean D.</p>
                          <p className="text-sm text-brand-gray flex items-center gap-1">
                            <Star className="w-4 h-4 text-brand-accent fill-brand-accent" />
                            Acheteur vérifié
                          </p>
                        </div>
                        <div className="bg-brand-secondary text-white text-sm font-bold px-4 py-2 rounded-xl">
                          Score: 85
                        </div>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between p-3 bg-brand-background rounded-xl">
                          <span className="text-brand-gray">Budget</span>
                          <span className="font-semibold text-brand-dark">350.000 - 400.000 €</span>
                        </div>
                        <div className="flex justify-between p-3 bg-brand-background rounded-xl">
                          <span className="text-brand-gray">Zone</span>
                          <span className="font-semibold text-brand-dark">Ixelles, Uccle</span>
                        </div>
                        <div className="flex justify-between p-3 bg-brand-background rounded-xl">
                          <span className="text-brand-gray">Timing</span>
                          <span className="font-semibold text-brand-dark">3-6 mois</span>
                        </div>
                        <div className="flex justify-between p-3 bg-brand-secondary/10 rounded-xl">
                          <span className="text-brand-gray">Financement</span>
                          <span className="font-semibold text-brand-secondary">
                            Pré-approuvé ✓
                          </span>
                        </div>
                      </div>
                      <div className="mt-5 pt-5 border-t border-brand-gray-light/50 flex flex-wrap gap-2">
                        <span className="bg-brand-primary/10 text-brand-primary text-xs font-medium px-3 py-1.5 rounded-full">
                          2+ chambres
                        </span>
                        <span className="bg-brand-primary/10 text-brand-primary text-xs font-medium px-3 py-1.5 rounded-full">
                          Terrasse
                        </span>
                        <span className="bg-brand-primary/10 text-brand-primary text-xs font-medium px-3 py-1.5 rounded-full">
                          Parking
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Floating notification */}
                  <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-card p-4 animate-float" style={{ animationDelay: "1s" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-brand-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-brand-gray">Compatibilité</p>
                        <p className="font-bold text-brand-primary">94%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 bg-brand-dark relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-dark to-brand-primary/20" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-brand-secondary/10 rounded-full blur-2xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Des chiffres qui parlent
              </h2>
              <p className="text-gray-400 text-lg">
                Une approche transparente et équitable
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 hover:bg-white/10 transition-colors">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  0%
                </div>
                <p className="text-gray-400 text-sm md:text-base">Commission sur les ventes</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 hover:bg-white/10 transition-colors">
                <div className="text-4xl md:text-5xl font-bold text-brand-primary mb-2">
                  79€
                </div>
                <p className="text-gray-400 text-sm md:text-base">Par espace d'échange activé</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 hover:bg-white/10 transition-colors">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  100%
                </div>
                <p className="text-gray-400 text-sm md:text-base">Gratuit pour les acheteurs</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 hover:bg-white/10 transition-colors">
                <div className="text-4xl md:text-5xl font-bold text-brand-secondary mb-2">
                  7j
                </div>
                <p className="text-gray-400 text-sm md:text-base">Garantie de réponse</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-brand-secondary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              Lancez-vous dès maintenant
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-display-sm font-bold text-white mb-6">
              Prêt à changer la donne ?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              Rejoignez ImmoJuste et découvrez une nouvelle façon de faire de
              l'immobilier. Plus juste, plus transparente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/onboarding/acheteur">
                <Button
                  size="xl"
                  className="w-full sm:w-auto bg-white text-brand-primary hover:bg-gray-50 shadow-card-elevated group"
                >
                  Créer mon profil acheteur
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/onboarding/vendeur">
                <Button
                  size="xl"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 backdrop-blur"
                >
                  Tester mon bien gratuitement
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-white/60 text-sm">
              Inscription en moins de 2 minutes • Aucune carte bancaire requise
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
