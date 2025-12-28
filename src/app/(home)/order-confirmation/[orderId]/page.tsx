import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  CheckCircle2,
  Package,
  ArrowRight,
  Home,
  Download,
} from "lucide-react";

interface PageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function OrderConfirmationPage(props: PageProps) {
  const params = await props.params;
  const { orderId } = params;

  // ১. অর্ডার নাম্বার দিয়ে ডাটা আনা
  const order = await prisma.order.findUnique({
    where: { orderNumber: orderId },
    include: {
      // ✅ FIX: স্কিমা অনুযায়ী নাম 'items' হবে (আগে orderItems ছিল)
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8">
        {/* Success Header */}
        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <CheckCircle2
              className="h-10 w-10 text-green-600"
              strokeWidth={3}
            />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Order Confirmed!
          </h2>
          <p className="mt-2 text-gray-500">
            Thank you for your purchase. Your order ID is{" "}
            <span className="font-bold text-gray-900">#{order.orderNumber}</span>
          </p>
        </div>

        {/* Receipt Card */}
        <div className="bg-white py-8 px-6 shadow-xl shadow-gray-200/50 rounded-3xl border border-gray-100 animate-in fade-in zoom-in duration-500 delay-150">
          <div className="flex justify-between items-center border-b border-gray-100 pb-6 mb-6">
            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-medium text-gray-900">{formattedDate}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Payment Method</p>
              <p className="font-medium text-gray-900 capitalize">
                {order.paymentMethod}
              </p>
            </div>
          </div>

          {/* ✅ FIX: Items Rendering (order.items ব্যবহার করতে হবে) */}
          <div className="space-y-4 mb-6">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-500">
                    x{item.quantity}
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[200px] truncate">
                    {item.name}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Total Calculation */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Total Amount</span>
              <span className="font-bold text-gray-900">
                ${order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-8">
            <button className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              <Download size={18} /> Download Invoice
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm"
          >
            <Home size={18} /> Return Home
          </Link>
          <Link
            href="/products" // Products page link
            className="flex items-center justify-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 transition-all"
          >
            Continue Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
