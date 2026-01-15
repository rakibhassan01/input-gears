"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  ArrowRight,
  Search,
  Calendar,
  CreditCard,
  ShoppingBag,
  MoreVertical,
  ChevronRight,
  Clock,
  Filter,
} from "lucide-react";
import StatusBadge from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: Date;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  _count?: {
    items: number;
  };
  items?: OrderItem[];
}

interface OrderHistoryProps {
  orders: Order[];
}

export default function OrderHistoryView({ orders }: OrderHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) =>
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [orders, searchQuery]);

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-indigo-50 rounded-full scale-[2.5] opacity-50 blur-2xl" />
          <div className="relative h-24 w-24 bg-white rounded-[32px] shadow-xl shadow-indigo-100 flex items-center justify-center">
            <ShoppingBag className="text-indigo-600 w-12 h-12" strokeWidth={1.5} />
          </div>
        </div>
        <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
          No orders found
        </h3>
        <p className="text-gray-500 font-medium max-w-xs mb-8">
          Looks like you haven&apos;t placed any orders yet. Start shopping to fill this space!
        </p>
        <Link
          href="/products"
          className="px-8 py-4 bg-gray-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200 active:scale-95"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-6 md:p-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            Order History
          </h2>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Track and manage your recent purchases.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative group max-w-md w-full md:w-72">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search Order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-100 bg-white text-sm font-bold text-gray-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Desktop View (Table) */}
      <div className="hidden md:block bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 font-black text-gray-500 uppercase tracking-widest text-[10px]">
                  Order Details
                </th>
                <th className="px-6 py-5 font-black text-gray-500 uppercase tracking-widest text-[10px]">
                  Date
                </th>
                <th className="px-6 py-5 font-black text-gray-500 uppercase tracking-widest text-[10px]">
                  Status
                </th>
                <th className="px-6 py-5 font-black text-gray-500 uppercase tracking-widest text-[10px]">
                  Payment
                </th>
                <th className="px-6 py-5 font-black text-gray-500 uppercase tracking-widest text-[10px] text-right">
                  Total
                </th>
                <th className="px-8 py-5 font-black text-gray-500 uppercase tracking-widest text-[10px] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                        <Package size={24} />
                      </div>
                      <div>
                        <div className="font-black text-gray-900 leading-tight">
                          #{order.orderNumber}
                        </div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mt-0.5">
                          {order._count?.items || 0} ITEMS IN ORDER
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                        <Clock size={10} /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-gray-900 flex items-center gap-1.5">
                        <CreditCard size={14} className="text-gray-400" />
                        {order.paymentMethod}
                      </span>
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest mt-0.5",
                        order.paymentStatus === "PAID" ? "text-green-600" : "text-yellow-600"
                      )}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right font-black text-gray-900 text-base">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link
                      href={`/account/orders/${order.orderNumber}`}
                      className="inline-flex items-center justify-center h-10 w-10 bg-gray-100 text-gray-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all active:scale-95 shadow-sm"
                    >
                      <ArrowRight size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View (Cards) */}
      <div className="md:hidden space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-3xl border border-gray-100">
            <p className="text-gray-500 font-bold">No matching orders found.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.orderNumber}`}
              className="block bg-white rounded-3xl border border-gray-100 p-5 shadow-sm active:scale-[0.98] transition-transform"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <Package size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-black text-gray-900">
                      #{order.orderNumber}
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-tight">
                      <Calendar size={10} />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <StatusBadge status={order.status} />
              </div>

              {/* Item Previews (if available) */}
              {order.items && order.items.length > 0 && (
                <div className="flex items-center gap-2 mb-4 bg-gray-50/50 p-2 rounded-2xl overflow-x-auto scrollbar-hide">
                  {order.items.map((item) => (
                    <div key={item.id} className="relative h-12 w-12 rounded-xl bg-white border border-gray-100 overflow-hidden shrink-0 shadow-sm">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-300">
                          <Package size={16} />
                        </div>
                      )}
                    </div>
                  ))}
                  {order._count?.items && order._count.items > 3 && (
                    <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 text-[10px] font-black flex items-center justify-center shrink-0 border border-indigo-100">
                      +{order._count.items - 3}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Total Amount
                  </span>
                  <span className="text-lg font-black text-gray-900">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-indigo-600 font-black text-xs uppercase tracking-widest">
                  Details <ChevronRight size={14} strokeWidth={3} />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
