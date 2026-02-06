import Link from "next/link";
import Image from "next/image";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-background">
      {/* Header */}
      <header className="bg-white border-b border-brand-gray-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-immojuste.jpeg"
                alt="ImmoJuste"
                width={150}
                height={42}
                className="h-9 w-auto"
              />
            </Link>
            <Link
              href="/auth/login"
              className="text-sm text-brand-gray hover:text-brand-primary transition-colors"
            >
              Déjà un compte ? Se connecter
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {children}
      </main>
    </div>
  );
}
