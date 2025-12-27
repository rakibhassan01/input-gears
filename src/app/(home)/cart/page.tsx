"use client";

import dynamic from "next/dynamic";

// ✅ Dynamic Import (SSR False)
const CartView = dynamic(() => import("@/modules/cart/views/cart-view"), {
  ssr: false, // সার্ভারে রেন্ডার হবে না, তাই কোনো হাইডেশন এরর আসবে না
  loading: () => <CartSkeleton />, // লোডিং এর সময় কি দেখাবে (নিচে কোড দিচ্ছি)
});

export default function CartPage() {
  return (
    <div>
      <CartView />
    </div>
  );
}

// ✨ লোডিং এর সময় এই স্কেলিটন দেখাবে (Optional but Recommended)
function CartSkeleton() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse mb-8" />
      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8 space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
        <div className="lg:col-span-4">
          <div className="h-80 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
