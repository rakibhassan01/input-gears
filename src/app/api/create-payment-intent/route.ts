import { NextResponse } from "next/server";
import Stripe from "stripe";

// ✅ 1. কার্ট আইটেমের জন্য ইন্টারফেস ডিফাইন করা
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-12-15.clover",
  typescript: true, // ভালো প্র্যাকটিস, এটি টাইপ সেফটি নিশ্চিত করে
});

export async function POST(req: Request) {
  try {
    // ✅ 2. রিকোয়েস্ট বডি থেকে ডাটা টাইপ সেফভাবে নেওয়া
    const body = await req.json();
    const items: CartItem[] = body.items;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items found" }, { status: 400 });
    }

    // ✅ 3. Price Calculation (No 'any' here)
    const subtotal = items.reduce(
      (acc: number, item: CartItem) => acc + item.price * item.quantity,
      0
    );

    const shipping = subtotal > 1000 ? 0 : 60;
    const total = subtotal + shipping;

    // ✅ 4. Payment Intent তৈরি
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Cents এ কনভার্ট করা
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    // Error Handling Type Safety
    const errorMessage =
      error instanceof Error ? error.message : "Internal Error";
    console.error("Internal Error:", errorMessage);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
