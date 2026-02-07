"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Settings, UserPlus, Mail, Clock, CheckCircle, XCircle, Shield } from "lucide-react";

interface Invitation {
  id: string;
  email: string;
  expiresAt: string;
  usedAt: string | null;
  createdAt: string;
  inviter: { firstName: string | null; lastName: string | null; email: string };
}

export default function AdminSettingsPage() {
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const fetchInvitations = async () => {
    const res = await fetch("/api/admin/invite");
    const data = await res.json();
    setInvitations(data.invitations || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSending(true);

    try {
      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de l'envoi");
      } else {
        setSuccess(`Invitation envoyée à ${inviteEmail}`);
        setInviteEmail("");
        fetchInvitations();
      }
    } catch {
      setError("Une erreur est survenue");
    } finally {
      setSending(false);
    }
  };

  const getInviteStatus = (invitation: Invitation) => {
    if (invitation.usedAt) return { label: "Utilisée", variant: "success" as const, icon: CheckCircle };
    if (new Date(invitation.expiresAt) < new Date()) return { label: "Expirée", variant: "error" as const, icon: XCircle };
    return { label: "En attente", variant: "warning" as const, icon: Clock };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark flex items-center gap-2">
          <Settings className="w-6 h-6 text-brand-primary" />
          Paramètres
        </h1>
        <p className="text-brand-gray text-sm mt-1">Gérez les administrateurs et les invitations</p>
      </div>

      {/* Invite form */}
      <Card className="border-0 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-brand-primary" />
            Inviter un administrateur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvite} className="flex gap-3">
            <div className="flex-1">
              <Input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="email@exemple.com"
                leftIcon={<Mail className="w-5 h-5" />}
                required
              />
            </div>
            <Button type="submit" isLoading={sending} leftIcon={<UserPlus className="w-4 h-4" />}>
              Inviter
            </Button>
          </form>

          {error && (
            <div className="mt-3 bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-3 bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm">
              {success}
            </div>
          )}

          <p className="text-xs text-brand-gray mt-3">
            L'invitation expire après 7 jours. L'invité recevra un email avec un lien pour créer son compte admin.
          </p>
        </CardContent>
      </Card>

      {/* Invitations list */}
      <Card className="border-0 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-primary" />
            Invitations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded" />
              ))}
            </div>
          ) : invitations.length === 0 ? (
            <p className="text-brand-gray text-sm text-center py-6">
              Aucune invitation envoyée
            </p>
          ) : (
            <div className="space-y-3">
              {invitations.map((invitation) => {
                const status = getInviteStatus(invitation);
                const StatusIcon = status.icon;
                return (
                  <div
                    key={invitation.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <StatusIcon className={`w-5 h-5 ${
                        status.variant === "success" ? "text-green-500" :
                        status.variant === "error" ? "text-red-500" : "text-amber-500"
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-brand-dark">{invitation.email}</p>
                        <p className="text-xs text-brand-gray">
                          Invité par{" "}
                          {`${invitation.inviter.firstName || ""} ${invitation.inviter.lastName || ""}`.trim() || invitation.inviter.email}
                          {" "}le {new Date(invitation.createdAt).toLocaleDateString("fr-BE")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={status.variant} size="sm">
                        {status.label}
                      </Badge>
                      {!invitation.usedAt && new Date(invitation.expiresAt) > new Date() && (
                        <span className="text-xs text-brand-gray">
                          Expire le {new Date(invitation.expiresAt).toLocaleDateString("fr-BE")}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
