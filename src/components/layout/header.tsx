"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, LayoutDashboard, Settings, Heart } from "lucide-react";
import { SecureAccessSheet } from "@/components/auth/secure-access-sheet";

export function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
          isScrolled ? "shadow-nav" : "border-b border-brand-gray-light/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-immojuste.jpeg"
                alt="ImmoJuste"
                width={180}
                height={50}
                className="h-10 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/acheteur"
                className="px-4 py-2 text-brand-dark hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-all font-medium"
              >
                Acheteurs
              </Link>
              <Link
                href="/vendeur"
                className="px-4 py-2 text-brand-dark hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-all font-medium"
              >
                Vendeurs
              </Link>
              <Link
                href="/agent"
                className="px-4 py-2 text-brand-dark hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-all font-medium"
              >
                Agents
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {session ? (
                <div className="flex items-center gap-3">
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="text-brand-dark">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-full border border-brand-gray-light hover:shadow-card transition-all bg-white"
                    >
                      <Menu className="h-4 w-4 text-brand-gray" />
                      <div className="w-8 h-8 bg-brand-dark rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    </button>
                    {isProfileOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsProfileOpen(false)}
                        />
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-modal z-50 overflow-hidden animate-fade-in">
                          <div className="p-3 border-b border-brand-gray-light/50">
                            <p className="font-semibold text-brand-dark truncate">
                              {session.user?.name || "Utilisateur"}
                            </p>
                            <p className="text-sm text-brand-gray truncate">
                              {session.user?.email}
                            </p>
                          </div>
                          <div className="p-2">
                            <Link
                              href="/dashboard"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm text-brand-dark hover:bg-brand-background rounded-lg transition-colors"
                            >
                              <LayoutDashboard className="h-4 w-4 text-brand-gray" />
                              Tableau de bord
                            </Link>
                            <Link
                              href="/dashboard/favorites"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm text-brand-dark hover:bg-brand-background rounded-lg transition-colors"
                            >
                              <Heart className="h-4 w-4 text-brand-gray" />
                              Favoris
                            </Link>
                            <Link
                              href="/dashboard/settings"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm text-brand-dark hover:bg-brand-background rounded-lg transition-colors"
                            >
                              <Settings className="h-4 w-4 text-brand-gray" />
                              Paramètres
                            </Link>
                          </div>
                          <div className="p-2 border-t border-brand-gray-light/50">
                            <button
                              onClick={() => {
                                signOut();
                                setIsProfileOpen(false);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-brand-dark hover:bg-brand-background rounded-lg transition-colors"
                            >
                              <LogOut className="h-4 w-4 text-brand-gray" />
                              Déconnexion
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="text-brand-dark font-medium"
                    onClick={() => setShowLogin(true)}
                  >
                    Connexion
                  </Button>
                  <Link href="/onboarding/acheteur">
                    <Button className="shadow-button hover:shadow-button-hover">
                      S'inscrire
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-brand-background transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-brand-dark" />
              ) : (
                <Menu className="h-6 w-6 text-brand-dark" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white animate-slide-down border-t border-brand-gray-light/50">
            <div className="px-4 py-6 space-y-1">
              <Link
                href="/acheteur"
                className="block px-4 py-3 text-brand-dark hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Acheteurs
              </Link>
              <Link
                href="/vendeur"
                className="block px-4 py-3 text-brand-dark hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Vendeurs
              </Link>
              <Link
                href="/agent"
                className="block px-4 py-3 text-brand-dark hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Agents
              </Link>
              <div className="pt-4 border-t border-brand-gray-light/50 mt-4">
                {session ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-brand-dark hover:bg-brand-primary/5 rounded-xl transition-all font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-brand-gray hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all font-medium"
                    >
                      <LogOut className="h-5 w-5" />
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3 pt-2">
                    <Button
                      variant="outline"
                      className="w-full h-12"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setShowLogin(true);
                      }}
                    >
                      Connexion
                    </Button>
                    <Link href="/onboarding/acheteur" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full h-12 shadow-button">
                        S'inscrire gratuitement
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <SecureAccessSheet
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
      />
    </>
  );
}
