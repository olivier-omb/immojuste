import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  ArrowRight,
  Eye,
  Shield,
  Zap,
  Gift,
  Star,
} from "lucide-react";

export default function AcheteurPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-primary/5 via-white to-brand-primary/10 py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Gift className="h-4 w-4" />
                  100% Gratuit pour les acheteurs
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-brand-dark leading-tight">
                  Soyez trouvé par les vendeurs qui vous correspondent
                </h1>
                <p className="mt-6 text-xl text-brand-gray">
                  Créez votre profil acheteur et laissez les opportunités venir à
                  vous. Plus besoin de passer des heures à chercher sur les
                  portails.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link href="/onboarding/acheteur">
                    <Button size="xl" className="w-full sm:w-auto">
                      Créer mon profil gratuit
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                <p className="mt-4 text-sm text-brand-gray">
                  Inscription en 2 minutes. Aucune carte bancaire requise.
                </p>
              </div>

              {/* Visual */}
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-card p-6 max-w-md mx-auto">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-brand-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">Vous</span>
                    </div>
                    <div>
                      <p className="font-semibold text-brand-dark">
                        Votre profil acheteur
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          Score: 85
                        </div>
                        <span className="text-xs text-brand-gray">Vérifié</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between p-3 bg-brand-background rounded-lg">
                      <span className="text-brand-gray">Budget</span>
                      <span className="font-medium">350.000 - 420.000 €</span>
                    </div>
                    <div className="flex justify-between p-3 bg-brand-background rounded-lg">
                      <span className="text-brand-gray">Zones</span>
                      <span className="font-medium">Ixelles, Etterbeek</span>
                    </div>
                    <div className="flex justify-between p-3 bg-brand-background rounded-lg">
                      <span className="text-brand-gray">Timing</span>
                      <span className="font-medium">3-6 mois</span>
                    </div>
                    <div className="flex justify-between p-3 bg-brand-background rounded-lg">
                      <span className="text-brand-gray">Financement</span>
                      <span className="font-medium text-green-600">
                        Pré-approuvé
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-brand-primary/5 rounded-lg border border-brand-primary/20">
                    <p className="text-sm text-brand-dark">
                      <Star className="h-4 w-4 inline text-brand-primary mr-1" />
                      <strong>3 vendeurs</strong> ont consulté votre profil cette
                      semaine
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">
                Pourquoi créer votre profil ?
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Eye className="h-8 w-8 text-brand-primary" />
                </div>
                <h3 className="text-xl font-semibold text-brand-dark mb-3">
                  Devenez visible
                </h3>
                <p className="text-brand-gray">
                  Les vendeurs voient votre profil et peuvent vous contacter s'ils
                  ont un bien qui correspond.
                </p>
              </div>

              <div className="text-center p-8">
                <div className="w-16 h-16 bg-brand-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-brand-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-brand-dark mb-3">
                  Restez protégé
                </h3>
                <p className="text-brand-gray">
                  Vos coordonnées ne sont jamais partagées sans votre accord.
                  C'est vous qui décidez.
                </p>
              </div>

              <div className="text-center p-8">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-brand-primary" />
                </div>
                <h3 className="text-xl font-semibold text-brand-dark mb-3">
                  Gagnez du temps
                </h3>
                <p className="text-brand-gray">
                  Plus besoin de contacter des dizaines d'annonces. Les bonnes
                  opportunités viennent à vous.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 bg-brand-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">
                Comment ça marche ?
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-brand-dark mb-2">
                      Créez votre profil en 2 minutes
                    </h3>
                    <p className="text-brand-gray">
                      Renseignez votre budget, vos zones de recherche, votre
                      timing et vos critères. Plus votre profil est complet, plus
                      il est visible.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-brand-dark mb-2">
                      Recevez un score de qualification
                    </h3>
                    <p className="text-brand-gray">
                      Votre score reflète votre niveau de préparation (budget,
                      financement, timing). Un score élevé attire plus de
                      vendeurs.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-brand-dark mb-2">
                      Soyez contacté par des vendeurs
                    </h3>
                    <p className="text-brand-gray">
                      Les vendeurs qui ont un bien correspondant à vos critères
                      peuvent demander à vous contacter. Vous acceptez ou refusez.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-brand-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-brand-dark mb-2">
                      Visitez et achetez
                    </h3>
                    <p className="text-brand-gray">
                      Si le bien vous intéresse, organisez une visite directement
                      avec le vendeur. ImmoJuste ne prend aucune commission.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">
                Questions fréquentes
              </h2>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-brand-background rounded-xl">
                <h3 className="font-semibold text-brand-dark mb-2">
                  C'est vraiment gratuit ?
                </h3>
                <p className="text-brand-gray">
                  Oui, 100%. Les acheteurs ne paient jamais rien sur ImmoJuste.
                  Notre modèle repose sur les vendeurs et les agents.
                </p>
              </div>

              <div className="p-6 bg-brand-background rounded-xl">
                <h3 className="font-semibold text-brand-dark mb-2">
                  Mes données sont-elles protégées ?
                </h3>
                <p className="text-brand-gray">
                  Absolument. Vos coordonnées (email, téléphone) ne sont jamais
                  visibles directement. Un vendeur doit payer et vous devez
                  confirmer avant tout contact.
                </p>
              </div>

              <div className="p-6 bg-brand-background rounded-xl">
                <h3 className="font-semibold text-brand-dark mb-2">
                  Puis-je modifier mon profil ?
                </h3>
                <p className="text-brand-gray">
                  Oui, vous pouvez modifier vos critères à tout moment. Votre
                  score de qualification sera recalculé automatiquement.
                </p>
              </div>

              <div className="p-6 bg-brand-background rounded-xl">
                <h3 className="font-semibold text-brand-dark mb-2">
                  Et si je trouve mon bien ailleurs ?
                </h3>
                <p className="text-brand-gray">
                  Pas de problème. Vous pouvez désactiver votre profil à tout
                  moment. Il suffit d'un clic dans vos paramètres.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-brand-primary to-brand-primary-dark">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Prêt à être trouvé par le bon vendeur ?
            </h2>
            <p className="text-xl text-white/80 mb-10">
              Rejoignez les acheteurs qui reçoivent des opportunités au lieu de
              les chercher.
            </p>
            <Link href="/onboarding/acheteur">
              <Button
                size="xl"
                className="bg-white text-brand-primary hover:bg-gray-100"
              >
                Créer mon profil gratuit
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
