import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "sqlite"
  }),
  // 1. Email & Password Authentication
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  // 2. Social Providers
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  // 3. Security & Rate Limiting (Optional but recommended)
  rateLimit: {
    window: 10, // 10 seconds
    max: 100, // max requests
  },
});
