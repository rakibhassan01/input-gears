"use client";

import { useCart } from "@/hooks/use-cart";
import { useStore } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { placeOrder } from "@/actions/checkout";

export default function CheckoutPage() {
  const router = useRouter();
  const cartItems = useStore(useCart, (state) => state.items);
  const clearCart = useCart((state) => state.clearCart);
  const [loading, setLoading] = useState(false);

  // Safe Check
  if (!cartItems || cartItems.length === 0) {
    return <div className="p-10">Cart is empty</div>;
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    setLoading(true);

    // Server Action কল করা হচ্ছে
    const result = await placeOrder(cartItems, total);

    if (result.error) {
      alert(result.error); // যেমন: লগিন করা নেই
      setLoading(false);
    } else {
      // অর্ডার সাকসেস!
      clearCart(); // কার্ট খালি করে দিলাম
      router.push("/orders"); // অর্ডার লিস্টে পাঠিয়ে দিলাম
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h2 className="font-semibold mb-4">Order Summary</h2>
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between text-sm mb-2">
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>৳{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="border-t mt-4 pt-4 flex justify-between font-bold">
          <span>Total</span>
          <span>৳{total}</span>
        </div>
      </div>

      <Button
        onClick={handlePlaceOrder}
        disabled={loading}
        className="w-full h-12"
      >
        {loading ? "Processing..." : "Confirm & Place Order (COD)"}
      </Button>
    </div>
  );
}
