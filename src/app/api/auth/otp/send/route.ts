import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/email";

const sendOtpSchema = z.object({
  email: z.string().email("Email invalide"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = sendOtpSchema.parse(body);

    // Rate limit: max 3 OTPs per email per 15 minutes
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const recentOtps = await prisma.otpToken.count({
      where: {
        email,
        createdAt: { gt: fifteenMinutesAgo },
      },
    });

    if (recentOtps >= 3) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez dans quelques minutes." },
        { status: 429 }
      );
    }

    // Generate 6-digit code (dev: always 111111)
    const code = process.env.NODE_ENV === "development" ? "111111" : Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP (expires in 10 minutes)
    await prisma.otpToken.create({
      data: {
        email,
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    // Send email (skip in dev if Resend not configured)
    if (process.env.RESEND_API_KEY) {
      await sendOtpEmail({ recipientEmail: email, code });
    } else {
      console.log(`[DEV] OTP code for ${email}: ${code}`);
    }

    return NextResponse.json({ message: "Code envoyé" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("OTP send error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
