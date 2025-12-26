// app/cart/page.tsx
"use client";


import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
  const cart = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // টোটাল প্রাইস ক্যালকুলেশন
  const total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Your cart is empty 😢
        </h2>
        <p className="text-gray-500">
          Looks like you haven't added anything yet.
        </p>
        <Button asChild>
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 border p-4 rounded-lg bg-white shadow-sm"
            >
              <div className="relative w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                <Image
                  src={item.image || "/placeholder.jpg"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
                <p className="font-bold text-indigo-600 mt-1">
                  ৳{item.price.toLocaleString()}
                </p>
              </div>

              <Button
                variant="destructive"
                size="icon"
                onClick={() => cart.removeItem(item.id)}
              >
                <Trash2 size={18} />
              </Button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>৳{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-4 border-b pb-4">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between text-xl font-bold mb-6">
              <span>Total</span>
              <span>৳{total.toLocaleString()}</span>
            </div>

            <Button className="w-full text-lg py-6">Proceed to Checkout</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
