"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Fetch all media assets from the library
 */
export async function getMedia() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "MANAGER")) {
    throw new Error("Unauthorized");
  }

  try {
    return await prisma.media.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch media:", error);
    throw new Error("Failed to fetch media");
  }
}

/**
 * Add a new asset to the media library
 */
export async function addToMediaLibrary(url: string, name?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "MANAGER")) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    // Avoid duplicates
    const existing = await prisma.media.findUnique({
      where: { url },
    });

    if (existing) {
      return { success: true, media: existing };
    }

    const media = await prisma.media.create({
      data: {
        url,
        name: name || url.split("/").pop()?.split(".")[0] || "Unnamed Asset",
      },
    });

    revalidatePath("/admin/media");
    return { success: true, media };
  } catch (error) {
    console.error("Failed to add to media library:", error);
    return { success: false, message: "Failed to add to media library" };
  }
}

/**
 * Delete an asset from the media library
 */
export async function deleteMedia(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "MANAGER")) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    await prisma.media.delete({
      where: { id },
    });

    revalidatePath("/admin/media");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete media:", error);
    return { success: false, message: "Failed to delete media" };
  }
}
