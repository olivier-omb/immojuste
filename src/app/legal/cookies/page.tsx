import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-brand-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-3xl shadow-card p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-2">
              Politique des Cookies
            </h1>
            <p className="text-brand-gray mb-8">
              Dernière mise à jour : 1er février 2025
            </p>

            <div className="prose prose-lg max-w-none text-brand-dark">
              <section className="mb-8">
                <h2 className="text-xl font-bold text-brand-dark mb-4">1. Qu'est-ce qu'un cookie ?</h2>
                <p className="text-brand-gray leading-relaxed mb-4">
                  Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur, tablette,
                  smartphone) lors de la visite d'un site web. Les cookies permettent au site de
                  reconnaître votre appareil et de mémoriser certaines informations sur vos préférences.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-brand-dark mb-4">2. Cookies utilisés par ImmoJuste</h2>

                <h3 className="text-lg font-semibold text-brand-dark mb-3 mt-6">2.1 Cookies strictement nécessaires</h3>
                <p className="text-brand-gray leading-relaxed mb-4">
                  Ces cookies sont indispensables au fonctionnement de la Plateforme. Ils ne peuvent pas
                  être désactivés.
                </p>
                <div className="bg-brand-background rounded-xl p-4 mb-4">
                  <table className="w-full text-sm text-brand-gray">
                    <thead>
                      <tr className="border-b border-brand-gray-light">
                        <th className="text-left py-2 font-semibold">Cookie</th>
                        <th className="text-left py-2 font-semibold">Finalité</th>
                        <th className="text-left py-2 font-semibold">Durée</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-brand-gray-light/50">
                        <td className="py-2">next-auth.session-token</td>
                        <td className="py-2">Authentification utilisateur</td>
                        <td className="py-2">Session</td>
                      </tr>
                      <tr className="border-b border-brand-gray-light/50">
                        <td className="py-2">next-auth.csrf-token</td>
                        <td className="py-2">Sécurité (protection CSRF)</td>
                        <td className="py-2">Session</td>
                      </tr>
                      <tr>
                        <td className="py-2">cookie-consent</td>
                        <td className="py-2">Mémorisation de vos choix cookies</td>
                        <td className="py-2">1 an</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-lg font-semibold text-brand-dark mb-3 mt-6">2.2 Cookies de performance et analytics</h3>
                <p className="text-brand-gray leading-relaxed mb-4">
                  Ces cookies nous permettent de comprendre comment les visiteurs utilisent notre
                  Plateforme afin de l'améliorer.
                </p>
                <div className="bg-brand-background rounded-xl p-4 mb-4">
                  <table className="w-full text-sm text-brand-gray">
                    <thead>
                      <tr className="border-b border-brand-gray-light">
                        <th className="text-left py-2 font-semibold">Cookie</th>
                        <th className="text-left py-2 font-semibold">Fournisseur</th>
                        <th className="text-left py-2 font-semibold">Durée</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-brand-gray-light/50">
                        <td className="py-2">_ga</td>
                        <td className="py-2">Google Analytics</td>
                        <td className="py-2">2 ans</td>
                      </tr>
                      <tr>
                        <td className="py-2">_gid</td>
                        <td className="py-2">Google Analytics</td>
                        <td className="py-2">24 heures</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-lg font-semibold text-brand-dark mb-3 mt-6">2.3 Cookies fonctionnels</h3>
                <p className="text-brand-gray leading-relaxed mb-4">
                  Ces cookies permettent d'améliorer votre expérience en mémorisant vos préférences.
                </p>
                <div className="bg-brand-background rounded-xl p-4 mb-4">
                  <table className="w-full text-sm text-brand-gray">
                    <thead>
                      <tr className="border-b border-brand-gray-light">
                        <th className="text-left py-2 font-semibold">Cookie</th>
                        <th className="text-left py-2 font-semibold">Finalité</th>
                        <th className="text-left py-2 font-semibold">Durée</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-brand-gray-light/50">
                        <td className="py-2">user-preferences</td>
                        <td className="py-2">Préférences d'affichage</td>
                        <td className="py-2">1 an</td>
                      </tr>
                      <tr>
                        <td className="py-2">recent-searches</td>
                        <td className="py-2">Historique de recherche</td>
                        <td className="py-2">30 jours</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-brand-dark mb-4">3. Gestion des cookies</h2>
                <p className="text-brand-gray leading-relaxed mb-4">
                  Lors de votre première visite, un bandeau vous permet de choisir les cookies que
                  vous acceptez. Vous pouvez modifier vos préférences à tout moment.
                </p>

                <h3 className="text-lg font-semibold text-brand-dark mb-3 mt-6">3.1 Via notre Plateforme</h3>
                <p className="text-brand-gray leading-relaxed mb-4">
                  Cliquez sur le bouton ci-dessous pour modifier vos préférences cookies :
                </p>
                <button className="bg-brand-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-primary-dark transition-colors mb-4">
                  Gérer mes préférences cookies
                </button>

                <h3 className="text-lg font-semibold text-brand-dark mb-3 mt-6">3.2 Via votre navigateur</h3>
                <p className="text-brand-gray leading-relaxed mb-4">
                  Vous pouvez également configurer votre navigateur pour refuser les cookies.
                  Voici les liens vers les instructions des principaux navigateurs :
                </p>
                <ul className="list-disc pl-6 text-brand-gray space-y-2 mb-4">
                  <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">Google Chrome</a></li>
                  <li><a href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">Mozilla Firefox</a></li>
                  <li><a href="https://support.apple.com/fr-be/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">Safari</a></li>
                  <li><a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">Microsoft Edge</a></li>
                </ul>
                <p className="text-brand-gray leading-relaxed">
                  <strong>Note :</strong> La désactivation de certains cookies peut affecter le fonctionnement
                  de la Plateforme.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-brand-dark mb-4">4. Cookies tiers</h2>
                <p className="text-brand-gray leading-relaxed mb-4">
                  Certains services tiers utilisés par notre Plateforme peuvent déposer leurs propres cookies :
                </p>
                <ul className="list-disc pl-6 text-brand-gray space-y-2 mb-4">
                  <li><strong>Stripe :</strong> pour le traitement sécurisé des paiements</li>
                  <li><strong>Google Analytics :</strong> pour les statistiques de fréquentation</li>
                </ul>
                <p className="text-brand-gray leading-relaxed">
                  Ces services ont leurs propres politiques de confidentialité que nous vous invitons à consulter.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-brand-dark mb-4">5. Durée de conservation</h2>
                <p className="text-brand-gray leading-relaxed mb-4">
                  Les cookies ont une durée de vie limitée, indiquée dans les tableaux ci-dessus.
                  À l'expiration de cette durée, les cookies sont automatiquement supprimés.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-brand-dark mb-4">6. Mise à jour de cette politique</h2>
                <p className="text-brand-gray leading-relaxed mb-4">
                  Cette politique peut être mise à jour pour refléter les évolutions de nos pratiques
                  ou de la réglementation. La date de dernière mise à jour est indiquée en haut de cette page.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-dark mb-4">7. Contact</h2>
                <p className="text-brand-gray leading-relaxed mb-4">
                  Pour toute question concernant notre utilisation des cookies :
                </p>
                <div className="bg-brand-background rounded-xl p-4 text-brand-gray">
                  <p><strong>ImmoJuste SRL</strong></p>
                  <p>Email : <a href="mailto:privacy@immojuste.be" className="text-brand-primary hover:underline">privacy@immojuste.be</a></p>
                  <p>Bruxelles, Belgique</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
