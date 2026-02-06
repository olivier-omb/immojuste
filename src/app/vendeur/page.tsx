import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  ArrowRight,
  Users,
  CreditCard,
  Shield,
  Zap,
  Target,
} from "lucide-react";

export default function VendeurPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-secondary/5 via-white to-brand-secondary/10 py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <CreditCard className="h-4 w-4" />
                  Payez uniquement au résultat
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-brand-dark leading-tight">
                  Vendez à des acheteurs qui cherchent vraiment
                </h1>
                <p className="mt-6 text-xl text-brand-gray">
                  Accédez à une base d'acheteurs qualifiés, avec budget vérifié et
                  financement en cours. Pas de curieux, pas de perte de temps.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link href="/onboarding/vendeur">
                    <Button size="xl" variant="success" className="w-full sm:w-auto">
                      Tester mon bien gratuitement
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                <p className="mt-4 text-sm text-brand-gray">
                  Encodez votre bien et voyez combien d'acheteurs correspondent.
                  Gratuit et sans engagement.
                </p>
              </div>

              {/* Visual */}
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-card p-6 max-w-md mx-auto">
                  <div className="text-center mb-6">
                    <p className="text-sm text-brand-gray">
                      Pour votre bien à Ixelles
                    </p>
                    <p className="text-4xl font-bold text-brand-dark mt-2">12</p>
                    <p className="text-brand-secondary font-medium">
                      acheteurs qualifiés
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        initials: "JD",
                        score: 92,
                        budget: "350-400k",
                        financing: "Pré-approuvé",
                      },
                      {
                        initials: "ML",
                        score: 85,
                        budget: "300-380k",
                        financing: "Approuvé",
                      },
                      {
                        initials: "PB",
                        score: 78,
                        budget: "320-360k",
                        financing: "Simulation",
                      },
                    ].map((buyer, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-brand-background rounded-lg"
                      >
                        <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {buyer.initials}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                              {buyer.score}%
                            </span>
                            <span className="text-sm font-medium">
                              {buyer.budget} €
                            </span>
                          </div>
                          <p className="text-xs text-brand-secondary">
                            {buyer.financing}
                          </p>
                        </div>
                        <div className="w-8 h-8 bg-brand-gray-light rounded-full flex items-center justify-center">
                          <span className="text-brand-gray text-xs">?</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-center">
                    <p className="text-sm text-brand-gray mb-3">
                      + 9 autres acheteurs compatibles
                    </p>
                    <Button className="w-full">
                      Activer un espace d'échange — 79€
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">
                Un modèle simple et transparent
              </h2>
              <p className="mt-4 text-lg text-brand-gray">
                Pas de commission sur la vente. Payez uniquement pour activer un espace d'échange.
              </p>
            </div>

            <div className="max-w-lg mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-card border-2 border-brand-primary relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-brand-primary text-white text-sm font-medium px-4 py-1 rounded-full">
                    Un seul prix, simple et transparent
                  </span>
                </div>
                <div className="text-center mb-6">
                  <p className="text-sm text-brand-gray mb-2">Par espace d'échange privé</p>
                  <p className="text-4xl font-bold text-brand-primary">79 € <span className="text-lg font-normal text-brand-gray">TTC</span></p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-brand-secondary" />
                    <span><strong>Activation d'un espace d'échange privé</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-brand-secondary" />
                    <span>Accès au profil complet de l'acheteur</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-brand-secondary" />
                    <span>Email et téléphone de l'acheteur</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-brand-secondary" />
                    <span>Garantie réponse 7 jours</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-brand-secondary" />
                    <span>Aucune commission sur la vente</span>
                  </li>
                </ul>
                <Link href="/onboarding/vendeur">
                  <Button className="w-full" size="lg">
                    Commencer gratuitement
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <p className="text-center mt-8 text-brand-gray">
              Comparez : une agence prend 3% de commission sur 350.000 € ={" "}
              <strong>10.500 €</strong>. ImmoJuste : <strong>79€</strong> par espace d'échange activé.
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-brand-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">
                Pourquoi ImmoJuste ?
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-card">
                <div className="w-14 h-14 bg-brand-secondary/10 rounded-xl flex items-center justify-center mb-6">
                  <Target className="h-7 w-7 text-brand-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-brand-dark mb-3">
                  Acheteurs qualifiés
                </h3>
                <p className="text-brand-gray">
                  Chaque acheteur a rempli un profil détaillé avec budget,
                  financement et timing. Pas de curieux.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-card">
                <div className="w-14 h-14 bg-brand-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <CreditCard className="h-7 w-7 text-brand-primary" />
                </div>
                <h3 className="text-xl font-semibold text-brand-dark mb-3">
                  Zéro commission
                </h3>
                <p className="text-brand-gray">
                  ImmoJuste ne prend aucune commission sur votre vente. Vous payez
                  uniquement pour les contacts.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-card">
                <div className="w-14 h-14 bg-brand-secondary/10 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="h-7 w-7 text-brand-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-brand-dark mb-3">
                  Garantie réponse
                </h3>
                <p className="text-brand-gray">
                  Si un acheteur contacté via un espace d'échange ne répond pas sous 7 jours,
                  nous vous offrons un crédit de remplacement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">
                Comment ça marche ?
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-brand-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-brand-dark mb-2">
                    Encodez votre bien gratuitement
                  </h3>
                  <p className="text-brand-gray">
                    Type, surface, localisation, prix demandé. Aucune photo
                    obligatoire, aucun engagement.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-brand-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-brand-dark mb-2">
                    Voyez les acheteurs compatibles
                  </h3>
                  <p className="text-brand-gray">
                    Notre algorithme identifie les acheteurs dont le profil
                    correspond à votre bien. Vous voyez leur score et leurs
                    critères.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-brand-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-brand-dark mb-2">
                    Choisissez qui contacter
                  </h3>
                  <p className="text-brand-gray">
                    Sélectionnez les profils qui vous intéressent et activez
                    un espace d'échange privé. 79€ par activation.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-brand-dark mb-2">
                    Organisez vos visites et vendez
                  </h3>
                  <p className="text-brand-gray">
                    Contactez directement les acheteurs, organisez les visites et
                    négociez. ImmoJuste ne s'immisce jamais dans la transaction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-brand-secondary to-brand-secondary-dark">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Prêt à trouver votre acheteur ?
            </h2>
            <p className="text-xl text-white/80 mb-10">
              Testez gratuitement et voyez combien d'acheteurs correspondent à
              votre bien.
            </p>
            <Link href="/onboarding/vendeur">
              <Button
                size="xl"
                className="bg-white text-brand-secondary hover:bg-gray-100"
              >
                Tester mon bien gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
