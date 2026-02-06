"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  User,
  Home,
  Users,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navigation = {
  BUYER: [
    { name: "Dashboard", href: "/dashboard/buyer", icon: LayoutDashboard },
    { name: "Mon profil", href: "/dashboard/buyer/profile", icon: User },
    { name: "Mes matches", href: "/dashboard/buyer/matches", icon: Home },
    { name: "Notifications", href: "/dashboard/buyer/notifications", icon: Bell },
  ],
  SELLER: [
    { name: "Dashboard", href: "/dashboard/seller", icon: LayoutDashboard },
    { name: "Mon bien", href: "/dashboard/seller/property", icon: Home },
    { name: "Acheteurs", href: "/dashboard/seller/matches", icon: Users },
    { name: "Notifications", href: "/dashboard/seller/notifications", icon: Bell },
  ],
  AGENT: [
    { name: "Dashboard", href: "/dashboard/agent", icon: LayoutDashboard },
    { name: "Leads", href: "/dashboard/agent/leads", icon: Users },
    { name: "Mon profil", href: "/dashboard/agent/profile", icon: User },
    { name: "Abonnement", href: "/dashboard/agent/subscription", icon: Settings },
  ],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary" />
      </div>
    );
  }

  if (!session) return null;

  const userRole = (session.user?.role as keyof typeof navigation) || "BUYER";
  const navItems = navigation[userRole] || navigation.BUYER;

  return (
    <div className="min-h-screen bg-brand-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-card transform transition-transform duration-200 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-brand-gray-light">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-immojuste.jpeg"
                alt="ImmoJuste"
                width={150}
                height={42}
                className="h-9 w-auto"
              />
            </Link>
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-brand-background"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b border-brand-gray-light">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-brand-dark truncate">
                  {session.user?.name || session.user?.email}
                </p>
                <p className="text-xs text-brand-gray capitalize">
                  {userRole.toLowerCase()}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-brand-gray hover:bg-brand-background hover:text-brand-dark transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-brand-gray-light">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-brand-gray hover:bg-brand-background hover:text-brand-dark transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-brand-gray-light h-16 flex items-center px-4 lg:px-8">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-brand-background mr-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1" />
          <Link
            href={`/dashboard/${userRole.toLowerCase()}/notifications`}
            className="p-2 rounded-lg hover:bg-brand-background relative"
          >
            <Bell className="h-5 w-5 text-brand-gray" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-brand-primary rounded-full" />
          </Link>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
