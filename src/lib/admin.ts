import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import prisma from "./prisma";
import { Prisma } from "@prisma/client";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, isDisabled: true },
  });

  if (!user || user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }

  if (user.isDisabled) {
    throw new Error("DISABLED");
  }

  return session;
}

export async function logActivity(
  action: string,
  entity?: string,
  entityId?: string,
  userId?: string,
  metadata?: Record<string, unknown>
) {
  try {
    await prisma.activityLog.create({
      data: {
        userId: userId || null,
        action,
        entity: entity || null,
        entityId: entityId || null,
        metadata: metadata ? (metadata as Prisma.InputJsonValue) : Prisma.JsonNull,
      },
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}
