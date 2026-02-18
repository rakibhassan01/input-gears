"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UserRole } from "@prisma/client";

export async function createAuditLog({
  adminId,
  action,
  entityType,
  entityId,
  details,
}: {
  adminId: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        adminId,
        action,
        entityType,
        entityId,
        details,
      },
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
    // We don't throw here to avoid breaking the main action if logging fails
  }
}

export async function getAuditLogs() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "MANAGER")) {
    throw new Error("Unauthorized");
  }

  try {
    return await prisma.auditLog.findMany({
      include: {
        admin: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch audit logs:", error);
    throw new Error("Failed to fetch audit logs");
  }
}
