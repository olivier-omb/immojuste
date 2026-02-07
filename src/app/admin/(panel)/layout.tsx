"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  GitCompare,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Utilisateurs", href: "/admin/users", icon: Users },
  { name: "Matches", href: "/admin/matches", icon: GitCompare },
  { name: "Paiements", href: "/admin/payments", icon: CreditCard },
  { name: "Paramètres", href: "/admin/settings", icon: Settings },
];

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-brand-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-brand-dark flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <Image
              src="/logo-immojuste.jpeg"
              alt="ImmoJuste"
              width={140}
              height={40}
              className="h-8 w-auto rounded"
            />
          </Link>
          <div className="flex items-center gap-2 mt-3 text-white/60">
            <Shield className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Administration</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-brand-primary text-white shadow-button"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div className="p-4 border-t border-white/10">
          <div className="px-4 py-3 mb-2">
            <p className="text-sm font-medium text-white truncate">
              {session?.user?.name || "Admin"}
            </p>
            <p className="text-xs text-white/50 truncate">
              {session?.user?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm text-white/70 hover:bg-white/10 hover:text-white transition-all"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-brand-gray-light px-4 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-brand-background"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="hidden lg:block">
            <h2 className="text-sm font-medium text-brand-dark">
              {navigation.find((n) => pathname === n.href || pathname.startsWith(n.href + "/"))?.name || "Administration"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-primary/10 rounded-full">
              <Shield className="w-4 h-4 text-brand-primary" />
              <span className="text-xs font-medium text-brand-primary">Admin</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
