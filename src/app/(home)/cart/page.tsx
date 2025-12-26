"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useStore } from "@/hooks/use-store";

export default function CartPage() {
  // ১. সেইফলি কার্ট ডেটা আনা (Modern Way)
  const cartItems = useStore(useCart, (state) => state.items);
  const removeItem = useCart((state) => state.removeItem);
  const addItem = useCart((state) => state.addItem); // কোয়ান্টিটি বাড়ানোর জন্য লজিক লাগবে

  // ২. লোডিং স্টেট হ্যান্ডেল করা (Hydration গ্যাপের জন্য)
  if (cartItems === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading cart...
      </div>
    );
  }

  // ৩. কার্ট খালি থাকলে
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <ShoppingBag className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Button asChild className="rounded-full px-8">
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  // ৪. টোটাল প্রাইস ক্যালকুলেশন
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">
        Shopping Cart ({cartItems.length})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Left Side: Product List --- */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm"
            >
              {/* Product Image */}
              <div className="relative w-24 h-24 bg-gray-50 rounded-lg overflow-hidden shrink-0 border">
                <Image
                  src={item.image || "/placeholder.jpg"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Price: ৳{item.price}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Quantity & Subtotal */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border rounded-md">
                    {/* Note: আমরা আপাতত শুধু রিমুভ অপশন রেখেছি, Quantity Update লজিক পরের ধাপে যোগ করব */}
                    <span className="px-3 py-1 text-sm font-bold">
                      Qty: {item.quantity}
                    </span>
                  </div>
                  <p className="font-bold text-indigo-600">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- Right Side: Summary --- */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-3 pb-6 mb-6 border-b border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>৳{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
            </div>

            <div className="flex justify-between text-xl font-bold mb-8">
              <span>Total</span>
              <span>৳{total.toLocaleString()}</span>
            </div>

            <Button className="w-full h-12 text-lg rounded-xl gap-2">
              Proceed to Checkout <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
