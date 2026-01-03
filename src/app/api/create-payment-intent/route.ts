import { NextResponse } from "next/server";
import Stripe from "stripe";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-12-15.clover",
  typescript: true,
});

export async function POST(req: Request) {
  try {
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

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Error";
    console.error("Internal Error:", errorMessage);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
