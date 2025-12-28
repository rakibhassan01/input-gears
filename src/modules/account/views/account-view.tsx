"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Package,
  CreditCard,
  Clock,
  BadgeCheck,
  LayoutDashboard,
  Shield,
  ArrowRight,
} from "lucide-react";
import StatusBadge from "@/components/shared/status-badge";
import { Order } from "@prisma/client";

interface AccountViewProps {
  session: {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
      role?: string | null; // ✅ Role থাকতে পারে (schema তে থাকলে)
    };
  };
  // ✅ Server থেকে আসা ডাটার টাইপ
  dashboardData: {
    totalOrders: number;
    pendingOrders: number;
    totalSpent: number;
    recentOrders: Order[]; // টাইপ safe করতে চাইলে Order টাইপ ইমপোর্ট করবেন
  };
}

export default function AccountView({
  session,
  dashboardData,
}: AccountViewProps) {
  const { user } = session;
  const { totalOrders, pendingOrders, totalSpent, recentOrders } =
    dashboardData;

  // ✅ Real Stats Data
  const stats = [
    {
      label: "Total Orders",
      value: totalOrders,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Total Spent",
      value: `$${totalSpent.toLocaleString()}`,
      icon: CreditCard,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  const isAdmin = user.role === "admin"; // আপনার ডাটাবেসে role field থাকলে

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Header Section (Profile Card) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50 rounded-full -mr-16 -mt-16 z-0 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            {/* Avatar */}
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={96}
                    height={96}
                    className="object-cover h-full w-full"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-3xl font-bold text-indigo-600 bg-indigo-50">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
              {/* ✅ Verified Badge for Admin */}
              {isAdmin && (
                <div
                  className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full border-2 border-white shadow-sm"
                  title="Verified Admin"
                >
                  <BadgeCheck size={16} />
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.name}
                </h1>
                {isAdmin && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-200 flex items-center gap-1">
                    <Shield size={10} /> Admin
                  </span>
                )}
              </div>
              <p className="text-gray-500">{user.email}</p>
              <p className="text-xs text-gray-400 mt-1">
                Member since {new Date().getFullYear()}
              </p>
            </div>
          </div>

          <Link
            href="/account/profile"
            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}
              >
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <LayoutDashboard size={20} className="text-gray-400" />
            Recent Orders
          </h3>
          <Link
            href="/account/orders"
            className="text-sm font-medium text-indigo-600 hover:underline flex items-center"
          >
            View All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        {/* Order Table / List */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-600">
                      Order ID
                    </th>
                    <th className="px-6 py-4 font-semibold text-gray-600">
                      Date
                    </th>
                    <th className="px-6 py-4 font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="px-6 py-4 font-semibold text-gray-600 text-right">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {order.orderNumber}
                      </td>
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
                      <td className="px-6 py-4 font-bold text-gray-900 text-right">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center">
              <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="text-gray-300" size={32} />
              </div>
              <h4 className="text-gray-900 font-medium">No orders yet</h4>
              <p className="text-gray-500 text-sm mt-1 mb-4">
                You haven&apos;t placed any orders yet.
              </p>
              <Link
                href="/products"
                className="inline-block px-5 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
