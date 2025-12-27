"use client";
import CheckoutSkeleton from "@/modules/checkout/components/checkout-skeleton";
import dynamic from "next/dynamic";

// CheckoutView কে ডাইনামিকালি ইমপোর্ট করুন
const CheckoutView = dynamic(
  () => import("@/modules/checkout/views/checkout-view"),
  {
    ssr: false, // চেকআউট সাধারণত ক্লায়েন্ট সাইড লজিকের ওপর নির্ভর করে (যেমন window, cart storage)
    loading: () => <CheckoutSkeleton />, // ✅ লোডিং এর সময় এই স্কেলিটন দেখাবে
  }
);
export default function CheckoutPage() {
  return <CheckoutView />;
}
