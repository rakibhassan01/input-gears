// actions/notes.ts
"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

// নোট সেভ করার ফাংশন
export async function createNote(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  // ১. ইউজার সেশন চেক করা
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  // ২. ডাটাবেসে সেভ করা
  try {
    await Prisma.note.create({
      data: {
        title: title || "Untitled Note",
        content: content || "",
        userId: userId,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Failed to create note" };
  }

  // ৩. ড্যাশবোর্ড আপডেট করা এবং রিডাইরেক্ট করা
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
