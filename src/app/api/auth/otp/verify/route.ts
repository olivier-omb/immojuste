import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const verifyOtpSchema = z.object({
  email: z.string().email("Email invalide"),
  code: z.string().length(6, "Code à 6 chiffres requis"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, code } = verifyOtpSchema.parse(body);

    // Find valid OTP
    const otpToken = await prisma.otpToken.findFirst({
      where: {
        email,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otpToken) {
      return NextResponse.json(
        { error: "Code invalide ou expiré" },
        { status: 400 }
      );
    }

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    // Check if draft exists
    const draftExists = await prisma.onboardingDraft.findUnique({
      where: { email },
      select: { id: true },
    });

    return NextResponse.json({
      valid: true,
      isNewUser: !userExists,
      hasDraft: !!draftExists,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("OTP verify error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
