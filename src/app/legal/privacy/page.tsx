import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-brand-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-3xl shadow-card p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-2">
              Politique de Confidentialité
            </h1>
            <p className="text-brand-gray mb-8">
              Dernière mise à jour : 1er février 2025
            </p>

            <div className="prose prose-lg max-w-none text-brand-dark">
              <section className="mb-8">
                <h2 className="text-xl font-bold text-brand-dark mb-4">1. Introduction</h2>
                <p className="text-brand-gray leading-relaxed mb-4">
                  ImmoJuste SRL ("nous", "notre", "nos") s'engage à protéger la vie privée des utilisateurs
                  de notre plateforme. Cette politique de confidentialité explique comment nous collectons,
                  utilisons, stockons et protégeons vos données personnelles conformément au Règlement Général
                  sur la Protection des Données (RGPD).
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-brand-dark mb-4">2. Données collectées</h2>
                <p className="text-brand-gray leading-relaxed mb-4">
                  Nous collectons les types de données suivants :
                </p>
                <ul className="list-disc pl-6 text-brand-gray space-y-2 mb-4">
                  <li><strong>Données d'identification :</strong> nom, prénom, adresse email, numéro de téléphone</li>
                  <li><strong>Données de profil acheteur :</strong> budget, zones de recherche, critères immobiliers, situation de financement</li>
                  <li><strong>Données de profil vendeur :</strong> informations sur le bien immobilier, localisation, caractéristiques</li>
                  <li><strong>Données de navigation :</strong> adresse IP, type de navigateur, pages visitées</li>
                  <li><strong>Données de paiement :</strong> traitées de manière sécurisée par notre prestataire Stripe</li>
                  <li><strong>Codes OTP :</strong> codes de vérification à usage unique envoyés par email, conservés 10 minutes maximum</li>
                  <li><strong>Brouillons d'inscription :</strong> données de formulaire temporaires, conservées 7 jours maximum avant suppression automatique</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-brand-dark mb-4">3. Finalités du traitement</h2>
                <p className="text-brand-gray leading-relaxed mb-4">
                  Vos données sont utilisées pour :
                </p>
                <ul className="list-disc pl-6 text-brand-gray space-y-2 mb-4">
                  <li>Créer et gérer votre compte utilisateur</li>
                  <li>Calculer les compatibilités entre acheteurs et vendeurs via notre algorithme de matching</li>
                  <li>Traiter vos paiements et facturation</li>
                  <li>Vous envoyer des notifications relatives à votre activité</li>
                  <li>Améliorer nos services et personnaliser votre expérience</li>
                  <li>Respecter nos obligations légales</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-brand-dark mb-4">4. Base légale</h2>
                <p className="text-brand-gray leading-relaxed mb-4">
                  Nous traitons vos données sur les bases légales suivantes :
                </p>
                <ul className="list-disc pl-6 text-brand-gray space-y-2 mb-4">
                  <li><strong>Exécution du contrat :</strong> pour fournir nos services</li>
                  <li><strong>Consentement :</strong> pour les communications marketing</li>
                  <li><strong>Intérêt légitime :</strong> pour améliorer nos services</li>
                  <li><strong>Obligation légale :</strong> pour respecter la réglementation</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-brand-dark mb-4">5. Partage des données</h2>
                <p className="text-brand-gray leading-relaxed mb-4">
                  Vos données peuvent être partagées avec :
                </p>
                <ul className="list-disc pl-6 text-brand-gray space-y-2 mb-4">
                  <li>Les autres utilisateurs de la plateforme (uniquement après activation d'un espace d'échange privé)</li>
                  <li>Nos prestataires techniques (hébergement, paiement, emails)</li>
                  <li>Les autorités compétentes si requis par la loi</li>
                </ul>
                <p className="text-brand-gray leading-relaxed">
                  Nous ne vendons jamais vos données personnelles à des tiers.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-brand-dark mb-4">6. Conservation des données</h2>
                <p className="text-brand-gray leading-relaxed mb-4">
                  Vos données sont conservées :
                </p>
                <ul className="list-disc pl-6 text-brand-gray space-y-2 mb-4">
                  <li>Pendant la durée de votre compte actif</li>
                  <li>3 ans après la dernière activité pour les données de profil</li>
                  <li>10 ans pour les données de facturation (obligation légale)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-brand-dark mb-4">7. Vos droits</h2>
                <p className="text-brand-gray leading-relaxed mb-4">
                  Conformément au RGPD, vous disposez des droits suivants :
                </p>
                <ul className="list-disc pl-6 text-brand-gray space-y-2 mb-4">
                  <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
                  <li><strong>Droit de rectification :</strong> corriger vos données</li>
                  <li><strong>Droit à l'effacement :</strong> supprimer vos données</li>
                  <li><strong>Droit à la portabilité :</strong> récupérer vos données dans un format standard</li>
                  <li><strong>Droit d'opposition :</strong> vous opposer à certains traitements</li>
                  <li><strong>Droit de limitation :</strong> limiter le traitement de vos données</li>
                </ul>
                <p className="text-brand-gray leading-relaxed">
                  Pour exercer ces droits, contactez-nous à : <a href="mailto:privacy@immojuste.be" className="text-brand-primary hover:underline">privacy@immojuste.be</a>
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-brand-dark mb-4">8. Sécurité</h2>
                <p className="text-brand-gray leading-relaxed mb-4">
                  Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour
                  protéger vos données : chiffrement SSL/TLS, accès restreints, audits réguliers,
                  hébergement sécurisé en Europe.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-brand-dark mb-4">9. Contact</h2>
                <p className="text-brand-gray leading-relaxed mb-4">
                  Pour toute question concernant cette politique ou vos données personnelles :
                </p>
                <div className="bg-brand-background rounded-xl p-4 text-brand-gray">
                  <p><strong>ImmoJuste SRL</strong></p>
                  <p>Délégué à la Protection des Données</p>
                  <p>Email : <a href="mailto:privacy@immojuste.be" className="text-brand-primary hover:underline">privacy@immojuste.be</a></p>
                  <p>Bruxelles, Belgique</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-dark mb-4">10. Modifications</h2>
                <p className="text-brand-gray leading-relaxed">
                  Nous pouvons modifier cette politique à tout moment. Les modifications significatives
                  vous seront notifiées par email ou via la plateforme. Nous vous encourageons à
                  consulter régulièrement cette page.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
