import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  ArrowRight,
  Users,
  TrendingUp,
  Briefcase,
  Crown,
  Zap,
  Target,
} from "lucide-react";

export default function AgentPage() {
  const plans = [
    {
      name: "Essentiel",
      price: 99,
      description: "Pour démarrer",
      features: [
        "10 leads acheteurs / mois",
        "1 zone géographique",
        "Profils avec score de qualif",
        "Support par email",
      ],
      notIncluded: ["Accès aux vendeurs", "CRM intégré", "Support prioritaire"],
      cta: "Commencer",
      popular: false,
    },
    {
      name: "Pro",
      price: 199,
      description: "Le plus populaire",
      features: [
        "30 leads acheteurs / mois",
        "3 zones géographiques",
        "Profils avec score de qualif",
        "CRM intégré",
        "Support chat prioritaire",
      ],
      notIncluded: ["Accès aux vendeurs opt-in"],
      cta: "Choisir Pro",
      popular: true,
    },
    {
      name: "Premium",
      price: 349,
      description: "Pour les agences",
      features: [
        "Leads illimités",
        "5 zones géographiques",
        "Accès aux vendeurs opt-in",
        "CRM + API",
        "Support téléphonique dédié",
        "Statistiques avancées",
      ],
      notIncluded: [],
      cta: "Contacter",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-dark/5 via-white to-brand-dark/10 py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-brand-dark/10 text-brand-dark px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Briefcase className="h-4 w-4" />
                Pour les professionnels de l'immobilier
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-brand-dark leading-tight">
                Accédez à la demande qualifiée, pas aux curieux
              </h1>
              <p className="mt-6 text-xl text-brand-gray">
                Des acheteurs avec budget vérifié, financement en cours et projet
                concret. Convertissez plus vite, prospectez moins.
              </p>
              <div className="mt-8">
                <Link href="/onboarding/agent">
                  <Button size="xl">
                    Essayer gratuitement 14 jours
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-brand-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl font-bold text-white">+500</p>
                <p className="text-gray-400">Acheteurs qualifiés</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-brand-primary">23%</p>
                <p className="text-gray-400">Taux de conversion moyen</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">48h</p>
                <p className="text-gray-400">Délai moyen 1er contact</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-brand-secondary">9x</p>
                <p className="text-gray-400">ROI moyen constaté</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">
                Pourquoi les agents choisissent ImmoJuste
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-brand-primary" />
                </div>
                <h3 className="text-xl font-semibold text-brand-dark mb-3">
                  Leads ultra-qualifiés
                </h3>
                <p className="text-brand-gray">
                  Chaque lead a un profil complet : budget, zones, timing,
                  financement. Fini les appels qui ne mènent nulle part.
                </p>
              </div>

              <div className="text-center p-8">
                <div className="w-16 h-16 bg-brand-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-8 w-8 text-brand-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-brand-dark mb-3">
                  Conversion accélérée
                </h3>
                <p className="text-brand-gray">
                  Nos agents constatent un taux de conversion 3x supérieur aux
                  leads classiques (portails, publicités).
                </p>
              </div>

              <div className="text-center p-8">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Crown className="h-8 w-8 text-brand-primary" />
                </div>
                <h3 className="text-xl font-semibold text-brand-dark mb-3">
                  Mandats exclusifs (Premium)
                </h3>
                <p className="text-brand-gray">
                  Avec le plan Premium, accédez aux vendeurs qui ont accepté
                  d'être contactés par des professionnels.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 bg-brand-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">
                Choisissez votre plan
              </h2>
              <p className="mt-4 text-lg text-brand-gray">
                Tous les plans incluent 14 jours d'essai gratuit
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`bg-white rounded-2xl p-8 ${
                    plan.popular
                      ? "shadow-card-hover ring-2 ring-brand-primary relative"
                      : "shadow-card"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-brand-primary text-white text-sm font-medium px-4 py-1 rounded-full">
                        Populaire
                      </span>
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <p className="text-sm text-brand-gray">{plan.description}</p>
                    <h3 className="text-2xl font-bold text-brand-dark mt-1">
                      {plan.name}
                    </h3>
                    <p className="mt-4">
                      <span className="text-4xl font-bold text-brand-dark">
                        {plan.price} €
                      </span>
                      <span className="text-brand-gray">/mois</span>
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-brand-secondary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                    {plan.notIncluded.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-brand-gray"
                      >
                        <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                          ×
                        </span>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features detail */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">
                  Un CRM pensé pour l'immobilier
                </h2>
                <p className="text-lg text-brand-gray mb-8">
                  Gérez vos leads, suivez vos conversions et mesurez votre ROI en
                  temps réel.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Zap className="h-6 w-6 text-brand-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium text-brand-dark">
                        Pipeline visuel
                      </p>
                      <p className="text-sm text-brand-gray">
                        Suivez chaque lead de la prise de contact au mandat signé
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="h-6 w-6 text-brand-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium text-brand-dark">
                        Notifications intelligentes
                      </p>
                      <p className="text-sm text-brand-gray">
                        Soyez alerté dès qu'un nouveau lead correspond à vos zones
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="h-6 w-6 text-brand-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium text-brand-dark">
                        Statistiques détaillées
                      </p>
                      <p className="text-sm text-brand-gray">
                        Taux de conversion, temps moyen de closing, ROI par zone
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-brand-background rounded-2xl p-8">
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Ce mois</span>
                      <span className="text-xs text-brand-gray">Janvier 2026</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-brand-dark">18</p>
                        <p className="text-xs text-brand-gray">Leads</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-brand-secondary">4</p>
                        <p className="text-xs text-brand-gray">RDV</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-500">2</p>
                        <p className="text-xs text-brand-gray">Mandats</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-sm font-medium mb-3">Pipeline</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        <span className="text-sm flex-1">Nouveau</span>
                        <span className="text-sm font-medium">8</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <span className="text-sm flex-1">Contacté</span>
                        <span className="text-sm font-medium">6</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full" />
                        <span className="text-sm flex-1">RDV planifié</span>
                        <span className="text-sm font-medium">2</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span className="text-sm flex-1">Mandat signé</span>
                        <span className="text-sm font-medium">2</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-brand-dark to-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Prêt à transformer votre prospection ?
            </h2>
            <p className="text-xl text-gray-400 mb-10">
              Rejoignez les agents qui convertissent plus avec moins d'effort.
            </p>
            <Link href="/onboarding/agent">
              <Button size="xl" className="bg-brand-primary hover:bg-brand-primary-dark">
                Essayer gratuitement 14 jours
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              Sans carte bancaire. Annulation à tout moment.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
