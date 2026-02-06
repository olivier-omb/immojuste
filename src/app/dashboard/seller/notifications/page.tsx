"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Users,
  CheckCircle,
  CreditCard,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Notification {
  id: string;
  type: "MATCH_NEW" | "BUYER_CONFIRMED" | "PAYMENT_SUCCESS" | "SYSTEM";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const iconMap = {
  MATCH_NEW: Users,
  BUYER_CONFIRMED: CheckCircle,
  PAYMENT_SUCCESS: CreditCard,
  SYSTEM: Bell,
};

const colorMap = {
  MATCH_NEW: "text-brand-primary bg-brand-primary/10",
  BUYER_CONFIRMED: "text-brand-secondary bg-brand-secondary/10",
  PAYMENT_SUCCESS: "text-green-500 bg-green-50",
  SYSTEM: "text-brand-gray bg-brand-background",
};

export default function SellerNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (err) {
        console.error("Failed to load notifications:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "POST" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/read-all", { method: "POST" });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-dark">
            Notifications
          </h1>
          <p className="text-brand-gray mt-1">
            {unreadCount > 0
              ? `${unreadCount} notification${unreadCount > 1 ? "s" : ""} non lue${unreadCount > 1 ? "s" : ""}`
              : "Vous êtes à jour"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Tout marquer comme lu
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm transition-all",
            filter === "all"
              ? "bg-brand-dark text-white"
              : "bg-white text-brand-gray hover:bg-brand-background"
          )}
        >
          Toutes ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm transition-all",
            filter === "unread"
              ? "bg-brand-primary text-white"
              : "bg-white text-brand-gray hover:bg-brand-background"
          )}
        >
          Non lues ({unreadCount})
        </button>
      </div>

      {filteredNotifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-brand-gray-light mb-4" />
            <h3 className="text-lg font-semibold text-brand-dark mb-2">
              {filter === "unread" ? "Aucune notification non lue" : "Aucune notification"}
            </h3>
            <p className="text-brand-gray text-center">
              Vous recevrez des notifications quand des acheteurs seront compatibles avec votre bien.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredNotifications.map((notif) => {
            const Icon = iconMap[notif.type] || Bell;
            const colorClass = colorMap[notif.type] || colorMap.SYSTEM;

            return (
              <Card
                key={notif.id}
                className={cn(
                  "transition-all hover:shadow-card cursor-pointer",
                  !notif.read && "border-l-4 border-l-brand-primary"
                )}
                onClick={() => !notif.read && markAsRead(notif.id)}
              >
                <CardContent className="p-4 flex items-start gap-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", colorClass)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("font-medium text-brand-dark", !notif.read && "font-bold")}>
                        {notif.title}
                      </p>
                      {!notif.read && (
                        <div className="w-2 h-2 bg-brand-primary rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                    <p className="text-sm text-brand-gray mt-0.5">{notif.message}</p>
                    <p className="text-xs text-brand-gray mt-2">
                      {formatDistanceToNow(new Date(notif.createdAt), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
