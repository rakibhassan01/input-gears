"use client";

import Link from "next/link";
import { Package, ArrowRight, ExternalLink } from "lucide-react";
import StatusBadge from "@/components/shared/status-badge";
import { Order } from "@prisma/client";

interface OrderHistoryProps {
  orders: Order[]; // টাইপ ঠিক করে নিবেন Prisma থেকে
}

export default function OrderHistoryView({ orders }: OrderHistoryProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="text-gray-400" size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-900">No orders found</h3>
        <p className="text-gray-500 text-sm mt-1 mb-6">
          You haven&apos;t placed any orders yet.
        </p>
        <Link
          href="/products"
          className="text-indigo-600 font-medium hover:underline"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Order History</h2>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-700">
                  Order ID
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                <th className="px-6 py-4 font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700">Total</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  {/* ✅ FIX: একটামাত্র td থাকবে */}
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/order-confirmation/${order.orderNumber}`} // অথবা ডিটেইলস পেজ
                      className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium text-xs"
                    >
                      View <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
