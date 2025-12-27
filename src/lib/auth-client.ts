import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000", // ক্লায়েন্ট সাইডে URL লাগবে
});

export const { signIn, signUp, useSession, signOut } = authClient;
