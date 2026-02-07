import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
  providers: [
    CredentialsProvider({
      id: "otp",
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.code) {
          throw new Error("Email et code requis");
        }

        // Verify OTP token
        const otpToken = await prisma.otpToken.findFirst({
          where: {
            email: credentials.email,
            code: credentials.code,
            used: false,
            expiresAt: { gt: new Date() },
          },
          orderBy: { createdAt: "desc" },
        });

        if (!otpToken) {
          throw new Error("Code invalide ou expiré");
        }

        // Mark OTP as used
        await prisma.otpToken.update({
          where: { id: otpToken.id },
          data: { used: true },
        });

        // Find or create user
        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          // Check for onboarding draft
          const draft = await prisma.onboardingDraft.findUnique({
            where: { email: credentials.email },
          });

          if (draft) {
            const draftData = draft.data as Record<string, unknown>;

            // Create user from draft
            user = await prisma.user.create({
              data: {
                email: credentials.email,
                emailVerified: new Date(),
                firstName: (draftData.firstName as string) || null,
                lastName: (draftData.lastName as string) || null,
                phone: (draftData.phone as string) || null,
                role: draft.role,
                consentTerms: (draftData.consentTerms as boolean) || false,
                consentPrivacy: (draftData.consentPrivacy as boolean) || false,
                consentMarketing: (draftData.consentMarketing as boolean) || false,
              },
            });

            // Delete draft after account creation
            await prisma.onboardingDraft.delete({
              where: { id: draft.id },
            });
          } else {
            // No draft: create minimal user (will complete profile later)
            user = await prisma.user.create({
              data: {
                email: credentials.email,
                emailVerified: new Date(),
                role: "BUYER",
              },
            });
          }
        }

        if (user.isDisabled) {
          throw new Error("Compte désactivé");
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
          role: user.role,
        };
      },
    }),
    CredentialsProvider({
      id: "admin-password",
      name: "Admin Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || user.role !== "ADMIN" || !user.password) {
          throw new Error("Identifiants invalides");
        }

        if (user.isDisabled) {
          throw new Error("Compte désactivé");
        }

        const bcrypt = await import("bcryptjs");
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Identifiants invalides");
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
