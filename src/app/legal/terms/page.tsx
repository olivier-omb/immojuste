import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-brand-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-3xl shadow-card p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-2">
              Conditions Générales d'Utilisation
            </h1>
            <p className="text-brand-gray mb-8">
              Dernière mise à jour : 1er février 2025
            </p>

            <div className="prose prose-lg max-w-none text-brand-dark">
              <section className="mb-8">
                <h2 className="text-xl font-bold text-brand-dark mb-4">1. Objet</h2>
                <p className="text-brand-gray leading-relaxed mb-4">
                  Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation
                  de la plateforme ImmoJuste, accessible à l'adresse www.immojuste.be. En utilisant notre
                  plateforme, vous acceptez ces conditions dans leur intégralité.
                </p>
                <p className="text-brand-gray leading-relaxed">
                  ImmoJuste est une plateforme technologique de matching immobilier permettant l'activation
                  d'espaces d'échange privés entre acheteurs qualifiés et vendeurs.
                  <strong>ImmoJuste n'est pas une agence immobilière</strong> et
                  n'intervient pas dans les transactions immobilières.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-brand-dark mb-4">2. Définitions</h2>
                <ul className="list-disc pl-6 text-brand-gray space-y-2 mb-4">
                  <li><strong>Plateforme :</strong> le site web et les services ImmoJuste</li>
                  <li><strong>Utilisateur :</strong> toute personne utilisant la Plateforme</li>
                  <li><strong>Acheteur :</strong> Utilisateur créant un profil de recherche immobilière</li>
                  <li><strong>Vendeur :</strong> Utilisateur proposant un bien immobilier</li>
                  <li><strong>Agent :</strong> Professionnel de l'immobilier utilisant la Plateforme</li>
                  <li><strong>Match :</strong> correspondance calculée algorithmiquement entre un profil acheteur et un bien</li>
                  <li><strong>Espace d'échange privé :</strong> espace activé par un Vendeur permettant la communication avec un Acheteur compatible</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-brand-dark mb-4">3. Inscription et compte</h2>
                <h3 className="text-lg font-semibold text-brand-dark mb-2">3.1 Conditions d'inscription</h3>
                <p className="text-brand-gray leading-relaxed mb-4">
                  Pour créer un compte, vous devez être une personne physique majeure ou une personne morale
                  valablement constituée. Vous garantissez l'exactitude des informations fournies.
                </p>
                <h3 className="text-lg font-semibold text-brand-dark mb-2">3.2 Sécurité du compte</h3>
                <p className="text-brand-gray leading-relaxed mb-4">
                  Vous êtes responsable de la confidentialité de vos identifiants de connexion.
                  Toute activité réalisée depuis votre compte est présumée être de votre fait.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-brand-dark mb-4">4. Services pour les Acheteurs</h2>
                <p className="text-brand-gray leading-relaxed mb-4">
                  Les services pour les Acheteurs sont <strong>gratuits</strong>. En tant qu'Acheteur, vous pouvez :
                </p>
                <ul className="list-disc pl-6 text-brand-gray space-y-2 mb-4">
                  <li>Créer un profil de recherche détaillé</li>
                  <li>Recevoir des notifications de matching</li>
                  <li>Être contacté par des Vendeurs intéressés</li>
                  <li>Consulter les biens correspondant à vos critères</li>
                </ul>
                <p className="text-brand-gray leading-relaxed">
                  En créant un profil, vous acceptez que vos critères de recherche (anonymisés) soient
                  visibles par les Vendeurs. Vos coordonnées ne sont révélées qu'après activation
                  d'un espace d'échange privé par le Vendeur et votre consentement.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-brand-dark mb-4">5. Services pour les Vendeurs</h2>
                <p className="text-brand-gray leading-relaxed mb-4">
                  Les Vendeurs peuvent :
                </p>
                <ul className="list-disc pl-6 text-brand-gray space-y-2 mb-4">
                  <li>Créer une fiche de bien (gratuit)</li>
                  <li>Voir le nombre d'Acheteurs compatibles (gratuit)</li>
                  <li>Consulter les profils anonymisés des Acheteurs (gratuit)</li>
                  <li>Activer des espaces d'échange privés avec des Acheteurs (payant - voir tarifs)</li>
                </ul>
                <h3 className="text-lg font-semibold text-brand-dark mb-2">5.1 Tarification</h3>
                <div className="bg-brand-background rounded-xl p-4 text-brand-gray mb-4">
                  <p><strong>Activation d'espace d'échange privé :</strong> 79€ TTC par activation</p>
                </div>
                <p className="text-brand-gray leading-relaxed">
                  Les prix sont indiqués TTC. Aucune commission n'est prélevée sur les transactions immobilières.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-brand-dark mb-4">6. Services pour les Agents</h2>
                <p className="text-brand-gray leading-relaxed mb-4">
                  Les Agents immobiliers bénéficient d'abonnements mensuels leur donnant accès à des leads
                  qualifiés dans leurs zones d'activité. Voir nos offres sur la page dédiée.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-brand-dark mb-4">7. Obligations des Utilisateurs</h2>
                <p className="text-brand-gray leading-relaxed mb-4">
                  Tout Utilisateur s'engage à :
                </p>
                <ul className="list-disc pl-6 text-brand-gray space-y-2 mb-4">
                  <li>Fournir des informations exactes et à jour</li>
                  <li>Ne pas usurper l'identité d'un tiers</li>
                  <li>Ne pas utiliser la Plateforme à des fins illicites</li>
                  <li>Respecter les autres Utilisateurs</li>
                  <li>Ne pas contourner les mécanismes de la Plateforme</li>
                  <li>Ne pas collecter les données d'autres Utilisateurs</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-brand-dark mb-4">8. Responsabilité</h2>
                <h3 className="text-lg font-semibold text-brand-dark mb-2">8.1 Rôle de plateforme technologique</h3>
                <p className="text-brand-gray leading-relaxed mb-4">
                  ImmoJuste agit uniquement en tant que plateforme technologique de matching. Nous ne garantissons pas :
                </p>
                <ul className="list-disc pl-6 text-brand-gray space-y-2 mb-4">
                  <li>La conclusion d'une transaction immobilière</li>
                  <li>L'exactitude des informations fournies par les Utilisateurs</li>
                  <li>La solvabilité des Acheteurs ou la conformité des biens</li>
                </ul>
                <h3 className="text-lg font-semibold text-brand-dark mb-2">8.2 Limitation</h3>
                <p className="text-brand-gray leading-relaxed">
                  La responsabilité d'ImmoJuste est limitée au montant des sommes versées par l'Utilisateur
                  au cours des 12 derniers mois.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-brand-dark mb-4">9. Propriété intellectuelle</h2>
                <p className="text-brand-gray leading-relaxed mb-4">
                  La Plateforme, son design, ses fonctionnalités et contenus sont protégés par le droit
                  de la propriété intellectuelle. Toute reproduction non autorisée est interdite.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-brand-dark mb-4">10. Résiliation</h2>
                <p className="text-brand-gray leading-relaxed mb-4">
                  Vous pouvez supprimer votre compte à tout moment depuis vos paramètres. ImmoJuste peut
                  suspendre ou résilier votre compte en cas de violation des présentes CGU, après notification.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-brand-dark mb-4">11. Droit applicable et litiges</h2>
                <p className="text-brand-gray leading-relaxed mb-4">
                  Les présentes CGU sont régies par le droit belge. En cas de litige, une solution amiable
                  sera recherchée. À défaut, les tribunaux de Bruxelles seront compétents.
                </p>
                <p className="text-brand-gray leading-relaxed">
                  Conformément à la réglementation européenne, vous pouvez également recourir à la
                  plateforme de règlement en ligne des litiges de la Commission européenne.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-brand-dark mb-4">12. Modifications</h2>
                <p className="text-brand-gray leading-relaxed mb-4">
                  ImmoJuste se réserve le droit de modifier les présentes CGU. Les modifications seront
                  notifiées aux Utilisateurs et entreront en vigueur 30 jours après notification.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-dark mb-4">13. Contact</h2>
                <div className="bg-brand-background rounded-xl p-4 text-brand-gray">
                  <p><strong>ImmoJuste SRL</strong></p>
                  <p>Email : <a href="mailto:contact@immojuste.be" className="text-brand-primary hover:underline">contact@immojuste.be</a></p>
                  <p>Bruxelles, Belgique</p>
                  <p className="mt-2 text-sm">BCE : [À compléter]</p>
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
