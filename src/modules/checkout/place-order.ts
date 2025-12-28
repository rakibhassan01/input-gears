"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// ✅ 1. Strong Type Definitions
interface PlaceOrderFormData {
  fullName: string;
  phone: string;
  address: string;
  email?: string | null;
}

interface CartItemInput {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
}

// ফ্রন্টএন্ড থেকে পেমেন্ট মেথড সাধারণত lowercase এ আসে
type PaymentMethodInput = "cod" | "stripe";

export async function placeOrder(
  formData: PlaceOrderFormData,
  cartItems: CartItemInput[],
  paymentMethod: PaymentMethodInput,
  paymentIntentId?: string
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const user = session?.user;

    // Price Calculation
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const shipping = subtotal > 1000 ? 0 : 60;
    const total = subtotal + shipping;

    // ✅ 2. Map Payment Method (frontend 'cod' -> database 'COD')
    const dbPaymentMethod = paymentMethod === "cod" ? "COD" : "STRIPE";
    const isPaid = dbPaymentMethod === "STRIPE" && paymentIntentId;
    const order = await prisma.order.create({
      data: {
        userId: user?.id || null,
        name: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        email: formData.email || null,

        totalAmount: total,
        // ✅ Status Logic Update
        status: isPaid ? "PROCESSING" : "PENDING",
        paymentStatus: isPaid ? "PAID" : "PENDING",
        paymentMethod: dbPaymentMethod,

        // ✅ Stripe ID Save
        stripePaymentIntentId: paymentIntentId || null,

        items: {
          create: cartItems.map((item) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || null,
          })),
        },
      },
    });

    return { success: true, orderId: order.id };
  } catch (error) {
    // Type checking for error message
    const errorMessage =
      error instanceof Error ? error.message : "Failed to place order";
    console.error("Order Error:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
