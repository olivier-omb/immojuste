import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const draftSchema = z.object({
  email: z.string().email("Email invalide"),
  role: z.enum(["BUYER", "SELLER", "AGENT"]),
  data: z.record(z.string(), z.unknown()),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, role, data } = draftSchema.parse(body);

    // Upsert draft (7 day TTL)
    const jsonData = data as unknown as Record<string, string | number | boolean | null>;
    await prisma.onboardingDraft.upsert({
      where: { email },
      update: {
        role,
        data: jsonData,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      create: {
        email,
        role,
        data: jsonData,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json({ message: "Draft sauvegardé" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Draft save error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }

    const draft = await prisma.onboardingDraft.findUnique({
      where: { email },
    });

    if (!draft || draft.expiresAt < new Date()) {
      return NextResponse.json(null);
    }

    return NextResponse.json(draft);
  } catch (error) {
    console.error("Draft get error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
