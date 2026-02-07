import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin, logActivity } from "@/lib/admin";
import { z } from "zod";
import crypto from "crypto";
import { sendAdminInviteEmail } from "@/lib/email";

const inviteSchema = z.object({
  email: z.string().email("Email invalide"),
});

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();
    const { email } = inviteSchema.parse(body);

    // Check if already an admin
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
      select: { role: true },
    });

    if (existingAdmin?.role === "ADMIN") {
      return NextResponse.json(
        { error: "Cet utilisateur est déjà administrateur" },
        { status: 400 }
      );
    }

    // Check for pending invitation
    const existingInvite = await prisma.adminInvitation.findUnique({
      where: { email },
    });

    if (existingInvite && !existingInvite.usedAt && existingInvite.expiresAt > new Date()) {
      return NextResponse.json(
        { error: "Une invitation est déjà en cours pour cet email" },
        { status: 400 }
      );
    }

    // Delete expired invitation if exists
    if (existingInvite) {
      await prisma.adminInvitation.delete({ where: { id: existingInvite.id } });
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invitation = await prisma.adminInvitation.create({
      data: {
        email,
        token,
        invitedBy: session.user.id,
        expiresAt,
      },
    });

    // Send invitation email
    const inviterName = session.user.name || session.user.email || "Admin";
    if (process.env.RESEND_API_KEY) {
      await sendAdminInviteEmail({ recipientEmail: email, inviterName, token });
    } else {
      console.log(`[DEV] Admin invite for ${email}: ${process.env.NEXT_PUBLIC_APP_URL}/admin/register?token=${token}`);
    }

    await logActivity("admin.invited", "AdminInvitation", invitation.id, session.user.id, { email });

    return NextResponse.json({ message: "Invitation envoyée", invitation: { id: invitation.id, email, expiresAt } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Erreur serveur";
    if (message === "UNAUTHORIZED" || message === "FORBIDDEN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await requireAdmin();

    const invitations = await prisma.adminInvitation.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        inviter: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
    });

    return NextResponse.json({ invitations });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur serveur";
    if (message === "UNAUTHORIZED" || message === "FORBIDDEN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
