import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/admin";
import { z } from "zod";
import bcrypt from "bcryptjs";

const registerSchema = z.object({
  token: z.string().min(1, "Token requis"),
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, firstName, lastName, password } = registerSchema.parse(body);

    // Find valid invitation
    const invitation = await prisma.adminInvitation.findUnique({
      where: { token },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation invalide" }, { status: 400 });
    }

    if (invitation.usedAt) {
      return NextResponse.json({ error: "Cette invitation a déjà été utilisée" }, { status: 400 });
    }

    if (invitation.expiresAt < new Date()) {
      return NextResponse.json({ error: "Cette invitation a expiré" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: invitation.email },
    });

    if (existingUser) {
      // Upgrade existing user to admin
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          role: "ADMIN",
          password: hashedPassword,
          firstName,
          lastName,
          emailVerified: new Date(),
        },
      });

      await prisma.adminInvitation.update({
        where: { id: invitation.id },
        data: { usedAt: new Date() },
      });

      await logActivity("admin.registered", "User", existingUser.id, existingUser.id, {
        method: "upgrade",
      });

      return NextResponse.json({ message: "Compte admin activé", email: invitation.email });
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: invitation.email,
        emailVerified: new Date(),
        password: hashedPassword,
        firstName,
        lastName,
        role: "ADMIN",
        consentTerms: true,
        consentPrivacy: true,
      },
    });

    await prisma.adminInvitation.update({
      where: { id: invitation.id },
      data: { usedAt: new Date() },
    });

    await logActivity("admin.registered", "User", user.id, user.id, {
      method: "new",
    });

    return NextResponse.json({ message: "Compte admin créé", email: invitation.email });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides", details: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token requis" }, { status: 400 });
    }

    const invitation = await prisma.adminInvitation.findUnique({
      where: { token },
      select: { email: true, expiresAt: true, usedAt: true },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation invalide" }, { status: 404 });
    }

    if (invitation.usedAt) {
      return NextResponse.json({ error: "Invitation déjà utilisée" }, { status: 400 });
    }

    if (invitation.expiresAt < new Date()) {
      return NextResponse.json({ error: "Invitation expirée" }, { status: 400 });
    }

    return NextResponse.json({ email: invitation.email });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
