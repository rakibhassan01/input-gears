// lib/stripe.ts
import { loadStripe } from "@stripe/stripe-js";

// আপনার .env ফাইল থেকে পাবলিক কি নিবে
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
