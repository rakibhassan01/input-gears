"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { placeOrder } from "@/app/actions/place-order"; // আপনার অ্যাকশন পাথ
import { stripePromise } from "@/lib/stripe"; // ✅ 1. Stripe Promise Import
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  CreditCard,
  MapPin,
  Loader2,
  ShieldCheck,
  User,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Validation Schema ---
const checkoutSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().min(11, "Valid phone number required"),
  address: z.string().min(10, "Full shipping address is required"),
  email: z.string().email().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

// =========================================================
// 🟢 MAIN COMPONENT (Parent) - Handles Client Secret & Wrapper
// =========================================================
export default function CheckoutForm() {
  const cart = useCart();
  const [clientSecret, setClientSecret] = useState("");

  // ১. কার্টে আইটেম থাকলে পেমেন্ট ইনটেন্ট ফেচ করা
  useEffect(() => {
    if (cart.items.length > 0) {
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart.items }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    }
  }, [cart.items]);

  // অপশনস ফর স্ট্রাইপ
  const options = {
    clientSecret,
    appearance: { theme: "stripe" as const }, // 'stripe' | 'night' | 'flat'
  };

  if (cart.items.length === 0) {
    return (
      <div className="text-center py-20 font-bold">Your cart is empty</div>
    );
  }

  // ✅ Client Secret না আসা পর্যন্ত লোডিং দেখাবে, তারপর ফর্ম রেন্ডার করবে
  return (
    <>
      {clientSecret ? (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutContent clientSecret={clientSecret} />
        </Elements>
      ) : (
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
      )}
    </>
  );
}

// =========================================================
// 🟡 CONTENT COMPONENT (Child) - Uses Stripe Hooks
// =========================================================
function CheckoutContent({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const cart = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "stripe">("cod");
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculations
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 1000 ? 0 : 60;
  const total = subtotal + shipping;

  const form = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      email: "",
    },
    mode: "onChange",
  });

  // Autofill
  useEffect(() => {
    if (session?.user) {
      form.setValue("fullName", session.user.name);
      form.setValue("email", session.user.email);
    }
  }, [session, form]);

  // --- 🚀 SUBMIT HANDLER ---
  const onSubmit = async (data: CheckoutFormValues) => {
    setIsProcessing(true);

    try {
      if (paymentMethod === "cod") {
        // ✅ COD Logic
        const result = await placeOrder(data, cart.items, "cod"); // Fixed Type Error
        if (result.success) {
          toast.success("Order confirmed via COD! 🎉");
          cart.clearCart();
          router.push(`/order-confirmation/${result.orderId}`);
        } else {
          toast.error("Failed to place order.");
        }
      } else {
        // ✅ Stripe Logic
        if (!stripe || !elements) return;

        // ১. আগে Stripe পেমেন্ট কনফার্ম করুন
        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/order-success`, // পেমেন্ট শেষে এখানে যাবে (এটি বানাতে হবে না হলে redirect: 'if_required' দিন)
          },
          redirect: "if_required", // পেজ রিফ্রেশ না করে হ্যান্ডেল করার জন্য
        });

        if (error) {
          toast.error(error.message || "Payment failed");
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
          // ২. পেমেন্ট সাকসেস হলে ডাটাবেসে অর্ডার সেভ করুন
          toast.success("Payment Successful!");

          const result = await placeOrder(data, cart.items, "stripe"); // "stripe" হিসেবে সেভ হবে

          if (result.success) {
            cart.clearCart();
            router.push(`/order-confirmation/${result.orderId}`);
          } else {
            toast.error(
              "Payment successful but order saving failed. Contact support."
            );
          }
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setIsProcessing(false);
    }
  };

  const isFormValid = form.formState.isValid;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Secure Checkout</h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start">
        {/* --- LEFT SIDE: INPUTS --- */}
        <div className="lg:col-span-7 space-y-8">
          <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Delivery Details (Same as before) */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <MapPin className="text-indigo-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Delivery Details
                </h2>
              </div>
              <div className="space-y-5">
                <div className="relative">
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      {...form.register("fullName")}
                      className={cn(
                        "w-full rounded-xl border-gray-200 border bg-gray-50/30 pl-11 pr-4 py-3 text-sm outline-none focus:border-indigo-500 transition-all",
                        form.formState.errors.fullName && "border-red-500"
                      )}
                      placeholder="Enter full name"
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      {...form.register("phone")}
                      className={cn(
                        "w-full rounded-xl border-gray-200 border bg-gray-50/30 pl-11 pr-4 py-3 text-sm outline-none focus:border-indigo-500 transition-all",
                        form.formState.errors.phone && "border-red-500"
                      )}
                      placeholder="017..."
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Address
                  </label>
                  <textarea
                    {...form.register("address")}
                    rows={2}
                    className={cn(
                      "w-full rounded-xl border-gray-200 border bg-gray-50/30 px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-all resize-none",
                      form.formState.errors.address && "border-red-500"
                    )}
                    placeholder="House, Road, City..."
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm mt-8">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <CreditCard size={20} className="text-indigo-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Payment Method
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => setPaymentMethod("cod")}
                  className={cn(
                    "relative p-5 border-2 rounded-2xl cursor-pointer transition-all flex items-start gap-4 hover:shadow-md",
                    paymentMethod === "cod"
                      ? "border-gray-900 bg-gray-50/50"
                      : "border-gray-100 bg-white"
                  )}
                >
                  <div
                    className={cn(
                      "h-5 w-5 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0",
                      paymentMethod === "cod"
                        ? "border-gray-900"
                        : "border-gray-300"
                    )}
                  >
                    {paymentMethod === "cod" && (
                      <div className="h-2.5 w-2.5 bg-gray-900 rounded-full" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      Cash On Delivery
                    </h3>
                    <p className="text-sm text-gray-500">
                      Pay when you receive
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod("stripe")}
                  className={cn(
                    "relative p-5 border-2 rounded-2xl cursor-pointer transition-all flex items-start gap-4 hover:shadow-md",
                    paymentMethod === "stripe"
                      ? "border-indigo-600 bg-indigo-50/50"
                      : "border-gray-100 bg-white"
                  )}
                >
                  <div
                    className={cn(
                      "h-5 w-5 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0",
                      paymentMethod === "stripe"
                        ? "border-indigo-600"
                        : "border-gray-300"
                    )}
                  >
                    {paymentMethod === "stripe" && (
                      <div className="h-2.5 w-2.5 bg-indigo-600 rounded-full" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Online Payment</h3>
                    <p className="text-sm text-gray-500">Cards / Stripe</p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* --- RIGHT SIDE: SUMMARY --- */}
        <div className="lg:col-span-5 mt-8 lg:mt-0 relative">
          <div className="sticky top-24">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50 relative overflow-hidden">
              <h2 className="text-xl font-bold text-gray-900 mb-6 relative z-10">
                Order Summary
              </h2>

              {/* Items List */}
              <div className="space-y-4 max-h-[240px] overflow-y-auto custom-scrollbar pr-2 mb-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="h-14 w-14 bg-gray-50 rounded-xl relative overflow-hidden">
                      <Image
                        src={item.image || ""}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500">${item.price}</p>
                    </div>
                    <p className="text-sm font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t border-dashed border-gray-200 pt-6 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
                </div>
                <div className="flex justify-between items-end pt-3 border-t border-gray-100 mt-3">
                  <span className="text-base font-bold">Total</span>
                  <span className="text-2xl font-extrabold text-indigo-600">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* ✅ STRIPE PAYMENT ELEMENT */}
              {paymentMethod === "stripe" && (
                <div className="mt-6 p-4 bg-white rounded-xl border border-indigo-200 shadow-inner animate-in fade-in">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">
                    Card Information
                  </label>
                  {/* 👇 আসল Stripe Element */}
                  <PaymentElement
                    id="payment-element"
                    options={{ layout: "tabs" }}
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                form="checkout-form"
                disabled={
                  isProcessing ||
                  !isFormValid ||
                  (!stripe && paymentMethod === "stripe")
                }
                className={cn(
                  "w-full mt-6 py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center",
                  isProcessing || !isFormValid
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-900 text-white hover:bg-indigo-600"
                )}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin mr-2" /> Processing...
                  </>
                ) : paymentMethod === "cod" ? (
                  "Confirm Order"
                ) : (
                  `Pay $${total.toFixed(2)}`
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400 bg-gray-50 py-2 rounded-lg">
                <ShieldCheck size={14} /> <span>Secure Encrypted Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
