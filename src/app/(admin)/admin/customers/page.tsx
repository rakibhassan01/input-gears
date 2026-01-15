import { prisma } from "@/lib/prisma";
import Image from "next/image";
import {
  Mail,
  MoreHorizontal,
  Users,
  Trophy,
  UserCheck,
  ArrowUpDown,
  Download,
} from "lucide-react";

import AdminSearch from "@/modules/admin/components/admin-search";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  // ১. ইউজার ডাটা ফেচিং (অর্ডার হিস্টোরি সহ)
  const users = await prisma.user.findMany({
    where: {
      role: "user",
      OR: q
        ? [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
          ]
        : undefined,
    },
    include: {
      orders: {
        select: { totalAmount: true, createdAt: true },
        orderBy: { createdAt: "desc" }, // লাস্ট অর্ডার ডেট পাওয়ার জন্য
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // ২. স্ট্যাটস ক্যালকুলেশন
  const totalCustomers = users.length;
  // যাদের অন্তত ১টা অর্ডার আছে
  const activeCustomers = users.filter((u) => u.orders.length > 0).length;
  // এই মাসে জয়েন করেছে (Example Logic)
  const newCustomersThisMonth = users.filter((u) => {
    const date = new Date(u.createdAt);
    const now = new Date();
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500">
            Manage your customer base and view insights.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-sm">
          <Download size={18} /> Export List
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">
              Total Customers
            </p>
            <h3 className="text-2xl font-bold text-gray-900">
              {totalCustomers}
            </h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">
              Active (Ordered)
            </p>
            <h3 className="text-2xl font-bold text-gray-900">
              {activeCustomers}
            </h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">
              New this Month
            </p>
            <h3 className="text-2xl font-bold text-gray-900">
              +{newCustomersThisMonth}
            </h3>
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between gap-4 bg-gray-50/50">
          <AdminSearch placeholder="Search name, email, phone..." />
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
            <ArrowUpDown size={16} /> Sort by LTV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Total Spent (LTV)</th>
                <th className="px-6 py-4">Orders</th>
                <th className="px-6 py-4">Last Active</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => {
                // Calculate LTV
                const totalSpent = user.orders.reduce(
                  (acc, order) => acc + order.totalAmount,
                  0
                );
                const isVIP = totalSpent > 500; // Example Condition
                const lastOrder = user.orders[0]?.createdAt;

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.name}
                              width={40}
                              height={40}
                              className="object-cover h-full w-full"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-500 font-bold">
                              {user.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              {user.name}
                            </span>
                            {isVIP && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                                VIP
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium 
                          ${
                            user.orders.length > 0
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                      >
                        {user.orders.length > 0 ? "Active" : "New"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      ${totalSpent.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {user.orders.length} orders
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {lastOrder
                        ? new Date(lastOrder).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`mailto:${user.email}`}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Send Email"
                        >
                          <Mail size={16} />
                        </a>
                        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
