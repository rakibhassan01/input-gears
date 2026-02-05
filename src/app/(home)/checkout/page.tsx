"use client";
import CheckoutSkeleton from "@/modules/checkout/components/checkout-skeleton";
import dynamic from "next/dynamic";

// Dynamically import CheckoutView
const CheckoutView = dynamic(
  () => import("@/modules/checkout/views/checkout-view"),
  {
    ssr: false, // Checkout relies on client-side logic (window, local storage)
    loading: () => <CheckoutSkeleton />,
  }
);
export default function CheckoutPage() {
  return <CheckoutView />;
}
