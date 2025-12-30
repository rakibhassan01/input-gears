"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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
    const random = Math.floor(1000 + Math.random() * 9000);
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

    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const shipping = subtotal > 1000 ? 0 : 60;
    const total = subtotal + shipping;

    const dbPaymentMethod = paymentMethod === "cod" ? "COD" : "STRIPE";
    const isPaid = dbPaymentMethod === "STRIPE" && !!paymentIntentId;

    const newOrderNumber = await generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber: newOrderNumber,
        userId: user?.id || null,
        name: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        email: formData.email || null,
        totalAmount: total,
        status: isPaid ? "PROCESSING" : "PENDING",
        paymentStatus: isPaid ? "PAID" : "PENDING",
        paymentMethod: dbPaymentMethod,
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

    return { success: true, orderId: order.orderNumber };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to place order";
    console.error("Order Error:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
