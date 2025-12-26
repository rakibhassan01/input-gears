"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// আমরা ক্লায়েন্ট থেকে কার্ট আইটেমগুলো রিসিভ করব
export async function placeOrder(cartItems: any[], totalAmount: number) {
  // ১. ইউজার চেক করা
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Please login to place an order" };
  }

  // ২. অর্ডার তৈরি করা (Transaction ব্যবহার করা ভালো, তবে সিম্পল রাখছি)
  try {
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        status: "PENDING",
        totalAmount: totalAmount,
        // অর্ডার আইটেমগুলো একসাথে তৈরি করা
        items: {
          create: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price, // যে দামে কেনা হচ্ছে
          })),
        },
      },
    });

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error(error);
    return { error: "Failed to place order" };
  }
}
