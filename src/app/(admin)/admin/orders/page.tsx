import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Search,
  Filter,
  Eye,
  MoreHorizontal,
  ArrowUpDown,
  Download,
  ShoppingBag,
  CreditCard,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Truck,
} from "lucide-react";
import OrderStatusSelector from "@/modules/admin/components/order-status-selector";

export default async function OrdersPage() {
  // ১. প্যারালাল ডাটা ফেচিং (High Performance)
  const [orders, stats] = await Promise.all([
    // A. Orders Fetching
    prisma.order.findMany({
      take: 20, // Pagination এর জন্য পরে limit বাড়াতে পারেন
      orderBy: { createdAt: "desc" },
      include: {
        user: true, // কাস্টমার ডিটেইলস এর জন্য
        // orderItems: true // যদি আইটেম গুনতে চান
      },
    }),

    // B. Aggregated Stats Calculation
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      _count: { _all: true },
    }),
  ]);

  // Status অনুযায়ী কাউন্ট বের করার জন্য আলাদা ছোট কুয়েরি (Optional but Fast)
  const pendingCount = await prisma.order.count({
    where: { status: "PENDING" },
  });
  const deliveredCount = await prisma.order.count({
    where: { status: "DELIVERED" },
  });

  const totalRevenue = stats._sum.totalAmount || 0;
  const totalOrders = stats._count._all || 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* 1. Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Orders Management
          </h1>
          <p className="text-sm text-gray-500">
            Track and manage all your store orders.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-sm">
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      {/* 2. KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between h-32 group hover:border-indigo-200 transition-colors">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
              <CreditCard size={20} />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              +12%
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              ${totalRevenue.toLocaleString()}
            </h3>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-1">
              Total Revenue
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between h-32 hover:border-blue-200 transition-colors">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{totalOrders}</h3>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-1">
              Total Orders
            </p>
          </div>
        </div>

        {/* Pending Processing */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between h-32 hover:border-amber-200 transition-colors">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Clock size={20} />
            </div>
            {pendingCount > 0 && (
              <span className="h-2 w-2 bg-amber-500 rounded-full animate-pulse"></span>
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{pendingCount}</h3>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-1">
              Pending Processing
            </p>
          </div>
        </div>

        {/* Delivered */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between h-32 hover:border-emerald-200 transition-colors">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <Truck size={20} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {deliveredCount}
            </h3>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-1">
              Completed Orders
            </p>
          </div>
        </div>
      </div>

      {/* 3. Main Order Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
          {/* Search */}
          <div className="relative max-w-sm w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search Order ID, Customer..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter size={16} /> Status
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <ArrowUpDown size={16} /> Date
            </button>
          </div>
        </div>

        {/* Table */}
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Payment</th>
                  <th className="px-6 py-4 font-medium">Fulfillment</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    {/* Order ID */}
                    <td className="px-6 py-4">
                      <span className="font-mono font-medium text-gray-900">
                        #{order.orderNumber.slice(-6).toUpperCase()}
                      </span>
                    </td>

                    {/* Customer Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 border border-gray-200">
                          {order.user?.name ? order.user.name.charAt(0) : "G"}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900 text-sm">
                            {order.user?.name || "Guest User"}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            {order.user?.email || "No email"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 font-bold text-gray-900">
                      ${order.totalAmount.toFixed(2)}
                    </td>

                    {/* Payment Status Badge */}
                    <td className="px-6 py-4">
                      {order.paymentStatus === "PAID" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-50 text-green-700 border border-green-200 text-xs font-medium">
                          <CheckCircle2 size={12} /> Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-50 text-red-700 border border-red-200 text-xs font-medium">
                          <AlertCircle size={12} /> Unpaid
                        </span>
                      )}
                    </td>

                    {/* Fulfillment Status Badge */}
                    <td className="px-6 py-4">
                      <OrderStatusSelector
                        orderId={order.id}
                        currentStatus={order.status}
                      />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </Link>
                        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={40} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No orders yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto mt-2">
              When customers place orders, they will appear here. Share your
              products to get started!
            </p>
          </div>
        )}

        {/* Pagination Footer */}
        {orders.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <p className="text-xs text-gray-500">
              Showing recent{" "}
              <span className="font-bold text-gray-900">{orders.length}</span>{" "}
              orders
            </p>
            <div className="flex gap-2">
              <button
                disabled
                className="px-3 py-1.5 text-xs font-medium text-gray-400 bg-white border border-gray-200 rounded-lg cursor-not-allowed"
              >
                Previous
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
