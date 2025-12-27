"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import {
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ArrowLeft,
  XCircle,
  ShieldCheck,
} from "lucide-react";

export default function CartView() {
  const cart = useCart();

  const subtotal = cart.items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 20;
  const total = subtotal + shipping;

  const handleQuantityChange = (id: string, value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 1) return;
    cart.updateQuantity(id, numValue);
  };

  // Empty State
  if (cart.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="h-28 w-28 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
          <span className="text-5xl">🛒</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
        <Link
          href="/"
          className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-shadow shadow-lg shadow-indigo-200"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-end gap-3">
        Shopping Cart
        <span className="text-lg font-medium text-gray-500 mb-1">
          ({totalItems} items)
        </span>
      </h1>

      {/* ✅ Sticky Fix: items-start is crucial here */}
      <div className="lg:grid lg:grid-cols-12 lg:gap-10 items-start relative">
        {/* --- Left: Cart Items List --- */}
        <div className="lg:col-span-8 space-y-6">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                {/* Image */}
                <div className="relative h-24 w-24 sm:h-28 sm:w-28 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 text-lg truncate hover:text-indigo-600 transition-colors">
                      <Link href={`/product/${item.id}`}>{item.name}</Link>
                    </h3>
                    <p className="text-gray-500 text-sm mt-1 font-medium">
                      Unit Price: ${item.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6">
                    {/* Quantity Input */}
                    <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200 shadow-sm">
                      <button
                        onClick={() =>
                          cart.updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm rounded transition-all disabled:opacity-30"
                      >
                        <Minus size={14} strokeWidth={2.5} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={item.maxStock}
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.id, e.target.value)
                        }
                        className="w-10 text-center bg-transparent border-none text-sm font-bold text-gray-900 focus:ring-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <button
                        onClick={() =>
                          cart.updateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.maxStock}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm rounded transition-all disabled:opacity-30"
                      >
                        <Plus size={14} strokeWidth={2.5} />
                      </button>
                    </div>

                    <p className="font-bold text-lg text-gray-900 w-24 text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                    <button
                      onClick={() => cart.removeItem(item.id)}
                      className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all flex-shrink-0"
                      title="Remove Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
            <Link
              href="/"
              className="flex items-center text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors group"
            >
              <ArrowLeft
                size={18}
                className="mr-2 group-hover:-translate-x-1 transition-transform"
              />
              Continue Shopping
            </Link>

            <button
              onClick={() => confirm("Clear cart?") && cart.clearCart()}
              className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
            >
              <XCircle size={16} />
              Clear Shopping Cart
            </button>
          </div>
        </div>

        {/* --- Right: Sticky Order Summary (Modernized) --- */}
        <div className="lg:col-span-4 mt-8 lg:mt-0 relative h-full">
          {/* ✅ Sticky Apply Here with top-24 */}
          <div className="sticky top-24 space-y-4">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-6 sm:p-8 overflow-hidden relative">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-50 rounded-full blur-2xl opacity-50 pointer-events-none"></div>

              <h2 className="text-xl font-bold text-gray-900 mb-6 relative z-10">
                Order Summary
              </h2>

              <div className="space-y-4 text-sm relative z-10">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded text-xs uppercase tracking-wide">
                      Free
                    </span>
                  ) : (
                    <span className="text-gray-900">
                      ${shipping.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Tax Estimate</span>
                  <span className="text-gray-400">--</span>
                  {/* Tax amount placeholder, text moved below */}
                </div>

                {/* Divider */}
                <div className="border-t border-dashed border-gray-200 my-4" />

                <div className="flex justify-between items-end">
                  <span className="text-base font-bold text-gray-900">
                    Total
                  </span>
                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-indigo-600 tracking-tight">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* ✅ Text Moved Here (Small) */}
                <p className="text-[11px] text-gray-400 text-right -mt-2">
                  Tax calculated at checkout
                </p>
              </div>

              <button className="w-full mt-8 bg-gray-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-600 hover:shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center group relative overflow-hidden">
                <span className="relative z-10 flex items-center">
                  Proceed to Checkout
                  <ArrowRight
                    size={20}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                  />
                </span>
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 py-2.5 rounded-lg border border-gray-100">
                <ShieldCheck size={14} className="text-indigo-500" />
                <span>Secure Encrypted Checkout</span>
              </div>
            </div>

            {/* Optional: Help Box beneath sticky summary */}
            <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100 text-center">
              <p className="text-xs text-indigo-600 font-medium">
                Need help?{" "}
                <a href="#" className="underline">
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
