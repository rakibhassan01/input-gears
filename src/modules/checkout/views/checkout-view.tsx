"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "@/lib/auth-client"; // ✅ সেশন হুক
import { toast } from "sonner";
import {
  CreditCard,
  MapPin,
  Loader2,
  Banknote,
  ShieldCheck,
  User,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- 1. Simplified Schema ---
const checkoutSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().min(11, "Valid phone number required"),
  address: z.string().min(10, "Full shipping address is required"),
  // Email অপশনাল বা হিডেন হতে পারে, তবে ট্র্যাকিংয়ের জন্য রাখা ভালো
  email: z.string().email().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutForm() {
  const cart = useCart();
  const { data: session } = useSession(); // ✅ অটোফিলের জন্য সেশন ডাটা
  const [isMounted, setIsMounted] = useState(false);

  // ✅ ডিফল্ট পেমেন্ট মেথড 'cod'
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "stripe">("cod");
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Calculations ---
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
    mode: "onChange", // বাটন ডিজেবল/এনাবল করার জন্য রিয়েল-টাইম চেক
  });

  // ✅ অটোফিল লজিক (সেশন লোড হলে)
  useEffect(() => {
    setIsMounted(true);
    if (session?.user) {
      form.setValue("fullName", session.user.name);
      form.setValue("email", session.user.email);
      // যদি ডাটাবেসে ফোন/এড্রেস থাকে তবে সেটাও এখানে সেট করতে পারেন
      // form.setValue("phone", session.user.phone);
    }
  }, [session, form]);

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsProcessing(true);
    try {
      // Simulate API Call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (paymentMethod === "cod") {
        toast.success("Order confirmed via Cash on Delivery! 🎉");
        cart.clearCart();
        // router.push("/success");
      } else {
        toast.info("Processing Stripe Payment...");
        // Stripe Logic Here
      }
    } catch (error) {
      toast.error("Order failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isMounted) return null;

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-gray-50 p-6 rounded-full mb-4">
          <Banknote size={40} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-gray-500 mt-2">
          Add some items to confirm your order.
        </p>
      </div>
    );
  }

  // ফর্ম ভ্যালিড কিনা চেক (বাটন ডিজেবল করার জন্য)
  const isFormValid = form.formState.isValid;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Secure Checkout</h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start">
        {/* --- LEFT SIDE: INPUTS --- */}
        <div className="lg:col-span-7 space-y-8">
          <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)}>
            {/* 1. Delivery Details (Simplified) */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <MapPin size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Delivery Details
                </h2>
              </div>

              <div className="space-y-5">
                {/* Full Name */}
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
                        "w-full rounded-xl border-gray-200 border bg-gray-50/30 pl-11 pr-4 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all",
                        form.formState.errors.fullName &&
                          "border-red-500 bg-red-50/10"
                      )}
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="relative">
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      {...form.register("phone")}
                      className={cn(
                        "w-full rounded-xl border-gray-200 border bg-gray-50/30 pl-11 pr-4 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all",
                        form.formState.errors.phone &&
                          "border-red-500 bg-red-50/10"
                      )}
                      placeholder="017xxxxxxxx"
                    />
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="relative">
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Shipping Address
                  </label>
                  <textarea
                    {...form.register("address")}
                    rows={3}
                    className={cn(
                      "w-full rounded-xl border-gray-200 border bg-gray-50/30 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all resize-none",
                      form.formState.errors.address &&
                        "border-red-500 bg-red-50/10"
                    )}
                    placeholder="House, Road, Area, City..."
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Options (Modern Cards) */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm mt-8">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="p-2 bg-green-50 rounded-lg text-green-600">
                  <Banknote size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Payment Method
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option 1: COD (Default) */}
                <div
                  onClick={() => setPaymentMethod("cod")}
                  className={cn(
                    "relative p-5 border-2 rounded-2xl cursor-pointer transition-all flex items-start gap-4 hover:shadow-md",
                    paymentMethod === "cod"
                      ? "border-gray-900 bg-gray-50/50"
                      : "border-gray-100 hover:border-gray-300 bg-white"
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
                    <p className="text-sm text-gray-500 mt-1">
                      Pay when you receive
                    </p>
                  </div>
                  {paymentMethod === "cod" && (
                    <CheckCircle2
                      className="absolute top-5 right-5 text-gray-900"
                      size={20}
                    />
                  )}
                </div>

                {/* Option 2: Online Payment */}
                <div
                  onClick={() => setPaymentMethod("stripe")}
                  className={cn(
                    "relative p-5 border-2 rounded-2xl cursor-pointer transition-all flex items-start gap-4 hover:shadow-md",
                    paymentMethod === "stripe"
                      ? "border-indigo-600 bg-indigo-50/50"
                      : "border-gray-100 hover:border-indigo-200 bg-white"
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
                    <p className="text-sm text-gray-500 mt-1">Cards / Stripe</p>
                  </div>
                  {paymentMethod === "stripe" && (
                    <CreditCard
                      className="absolute top-5 right-5 text-indigo-600"
                      size={20}
                    />
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* --- RIGHT SIDE: ORDER SUMMARY & ACTION --- */}
        <div className="lg:col-span-5 mt-8 lg:mt-0 relative">
          <div className="sticky top-24">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50 relative overflow-hidden">
              {/* Background Decor */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-10 -mt-10 z-0 pointer-events-none" />

              <h2 className="text-xl font-bold text-gray-900 mb-6 relative z-10">
                Order Summary
              </h2>

              {/* Items Mini List */}
              <div className="space-y-4 max-h-[240px] overflow-y-auto custom-scrollbar pr-2 mb-6 relative z-10">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="h-14 w-14 bg-gray-50 rounded-xl border border-gray-100 relative flex-shrink-0 overflow-hidden">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      )}
                      <span className="absolute bottom-0 right-0 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded-tl-md">
                        x{item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        ${item.price.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t border-dashed border-gray-200 pt-6 text-sm relative z-10">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-bold">Free</span>
                  ) : (
                    <span className="font-medium text-gray-900">
                      ${shipping.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-end pt-3 border-t border-gray-100 mt-3">
                  <span className="text-base font-bold text-gray-900">
                    Total Amount
                  </span>
                  <span className="text-2xl font-extrabold text-indigo-600">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* ✅ DYNAMIC STRIPE FIELD (Shows only if Online Payment is selected) */}
              {paymentMethod === "stripe" && (
                <div className="mt-6 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 animate-in fade-in slide-in-from-top-2">
                  <label className="text-xs font-semibold text-indigo-900 uppercase tracking-wide mb-2 block">
                    Card Details
                  </label>
                  {/* This is where Stripe Element will go later */}
                  <div className="h-12 w-full bg-white border border-indigo-200 rounded-lg flex items-center px-4 shadow-sm transition-colors focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
                    <CreditCard size={18} className="text-gray-400 mr-3" />
                    <input
                      placeholder="Card number"
                      className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400"
                      disabled // Placeholder
                    />
                  </div>
                  <p className="text-[10px] text-indigo-500 mt-2 flex items-center gap-1">
                    <ShieldCheck size={12} />
                    Encrypted by Stripe
                  </p>
                </div>
              )}

              {/* Confirm Button */}
              <button
                type="submit"
                form="checkout-form"
                disabled={isProcessing || !isFormValid} // ✅ বাটন ডিজেবল লজিক
                className={cn(
                  "w-full mt-6 py-4 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-[0.98] flex items-center justify-center",
                  isProcessing || !isFormValid
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none" // Disabled Style
                    : "bg-gray-900 text-white hover:bg-indigo-600 hover:shadow-indigo-200" // Active Style
                )}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={20} className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : paymentMethod === "cod" ? (
                  "Confirm Cash On Delivery"
                ) : (
                  `Pay $${total.toFixed(2)}`
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400 bg-gray-50 py-2 rounded-lg">
                <ShieldCheck size={14} />
                <span>Secure Encrypted Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
