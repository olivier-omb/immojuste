import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Twitter, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center mb-6">
              <Image
                src="/logo-immojuste.jpeg"
                alt="ImmoJuste"
                width={180}
                height={50}
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-gray-400 max-w-sm leading-relaxed mb-6">
              La première plateforme où les profils d'acheteurs qualifiés deviennent
              l'actif principal. L'immobilier commence par l'acheteur.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-white/5 hover:bg-brand-primary/20 rounded-xl flex items-center justify-center transition-colors group"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-gray-400 group-hover:text-brand-primary transition-colors" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/5 hover:bg-brand-primary/20 rounded-xl flex items-center justify-center transition-colors group"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-gray-400 group-hover:text-brand-primary transition-colors" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/5 hover:bg-brand-primary/20 rounded-xl flex items-center justify-center transition-colors group"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-brand-primary transition-colors" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/5 hover:bg-brand-primary/20 rounded-xl flex items-center justify-center transition-colors group"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-gray-400 group-hover:text-brand-primary transition-colors" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold mb-5 text-white">Plateforme</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/acheteur"
                  className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  Pour les acheteurs
                </Link>
              </li>
              <li>
                <Link
                  href="/vendeur"
                  className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  Pour les vendeurs
                </Link>
              </li>
              <li>
                <Link
                  href="/agent"
                  className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  Pour les agents
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  Tarifs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold mb-5 text-white">Légal</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/legal/privacy"
                  className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terms"
                  className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  Conditions générales
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/cookies"
                  className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  Politique cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-5 text-white">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:contact@immojuste.be"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-3"
                >
                  <Mail className="w-4 h-4 text-brand-primary" />
                  contact@immojuste.be
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                <span>Bruxelles, Belgique</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} ImmoJuste. Tous droits réservés.
            </p>
            <p className="text-gray-500 text-sm text-center md:text-right">
              ImmoJuste n'est pas une agence immobilière. Conforme au cadre IPI.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
