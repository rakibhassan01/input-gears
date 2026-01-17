"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Stripe from "stripe";
import { z } from "zod";
import { randomBytes } from "crypto";

interface CartItemInput {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
}

type PaymentMethodInput = "cod" | "stripe";

export async function generateOrderNumber() {
  let orderNumber = "";
  let isUnique = false;

  while (!isUnique) {
    const year = new Date().getFullYear().toString().slice(-2);
    const random = randomBytes(6).toString("hex").toUpperCase();
    orderNumber = `IG${year}${random}`;
    const existingOrder = await prisma.order.findUnique({
      where: { orderNumber },
    });
    if (!existingOrder) {
      isUnique = true;
    }
  }

  return orderNumber;
}
interface PlaceOrderFormData {
  fullName: string;
  phone: string;
  address: string;
  email?: string | null;
}

const placeOrderSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(11),
  address: z.string().min(10),
  email: z.union([z.literal(""), z.string().email(), z.null(), z.undefined()]),
});

const cartItemsSchema = z
  .array(
    z
      .object({
        id: z.string().min(1),
        quantity: z.number().int().positive().max(99),
      })
      .passthrough()
  )
  .min(1);

export async function placeOrder(
  formData: PlaceOrderFormData,
  cartItems: CartItemInput[],
  paymentMethod: PaymentMethodInput,
  paymentIntentId?: string
) {
  try {
    const validatedForm = placeOrderSchema.parse(formData);
    const validatedCartItems = cartItemsSchema.parse(cartItems);

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const user = session?.user;

    const uniqueProductIds = Array.from(
      new Set(validatedCartItems.map((i) => i.id))
    );

    const products = await prisma.product.findMany({
      where: { id: { in: uniqueProductIds } },
      select: { id: true, name: true, price: true, image: true, stock: true },
    });

    if (products.length !== uniqueProductIds.length) {
      throw new Error("Invalid cart items");
    }

    const productById = new Map<
      string,
      { id: string; name: string; price: number; image: string | null; stock: number }
    >(products.map((p) => [p.id, p]));
    for (const item of validatedCartItems) {
      const product = productById.get(item.id);
      if (!product) throw new Error("Invalid cart items");
      if (item.quantity > product.stock) throw new Error("Out of stock");
    }

    const subtotalCents = validatedCartItems.reduce((acc, item) => {
      const product = productById.get(item.id)!;
      const unitPriceCents = Math.round(product.price * 100);
      return acc + unitPriceCents * item.quantity;
    }, 0);

    const shippingCents = subtotalCents > 100000 ? 0 : 6000;
    const totalCents = subtotalCents + shippingCents;

    const dbPaymentMethod = paymentMethod === "cod" ? "COD" : "STRIPE";
    let isPaid = false;

    // --- 1. Stripe Verification (Outside Transaction) ---
    if (dbPaymentMethod === "STRIPE") {
      if (!paymentIntentId) {
        throw new Error("Missing payment intent");
      }
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error("Stripe is not configured");
      }

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2025-12-15.clover",
        typescript: true,
      });

      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (
        paymentIntent.status !== "succeeded" ||
        paymentIntent.amount !== totalCents ||
        paymentIntent.currency !== "usd"
      ) {
        throw new Error("Payment verification failed");
      }

      isPaid = true;
    }

    // --- 2. Order Number Generation (Outside Transaction) ---
    const newOrderNumber = await generateOrderNumber();

    // --- 3. Atomic Database Operations (Simplified Transaction) ---
    const result = await prisma.$transaction(async (tx) => {
      // Create the order and items
      const order = await tx.order.create({
        data: {
          orderNumber: newOrderNumber,
          userId: user?.id || null,
          name: validatedForm.fullName,
          phone: validatedForm.phone,
          address: validatedForm.address,
          email:
            validatedForm.email && validatedForm.email !== ""
              ? validatedForm.email
              : null,
          totalAmount: totalCents / 100,
          status: isPaid ? "PROCESSING" : "PENDING",
          paymentStatus: isPaid ? "PAID" : "PENDING",
          paymentMethod: dbPaymentMethod,
          stripePaymentIntentId: paymentIntentId || null,
          items: {
            create: validatedCartItems.map((item) => {
              const product = productById.get(item.id)!;
              return {
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.image || null,
              };
            }),
          },
        },
      });

      // Update product stocks
      for (const item of validatedCartItems) {
        await tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return { orderNumber: order.orderNumber };
    });

    return { success: true, orderId: result.orderNumber };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to place order";
    console.error("Order Error:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
