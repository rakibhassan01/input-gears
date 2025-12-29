import { prisma } from "@/lib/prisma";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  ArrowRight,
  RotateCcw,
  Clock,
  CheckCircle2,
  PieChart,
  XCircle,
  MoreHorizontal,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function AdminDashboardPage() {
  // ১. প্যারালাল ডাটা ফেচিং (Fast Performance)
  const [
    totalRevenue,
    totalOrders,
    totalProducts,
    totalCustomers,
    recentOrders,
    trendingProducts, // বাস্তবে এখানে OrderItem aggregate করে আনা হয়
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { paymentStatus: "PAID" },
    }),
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count({ where: { role: "user" } }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { user: true },
    }),
    // Dummy query for Trending (In real app, aggregate orderItems)
    prisma.product.findMany({
      take: 4,
      // orderBy: { orders: { _count: 'desc' } } // যদি রিলেশন থাকে
    }),
  ]);

  const revenue = totalRevenue._sum.totalAmount || 0;

  // Stats Array for UI
  const stats = [
    {
      title: "Total Revenue",
      value: `$${revenue.toLocaleString()}`,
      icon: DollarSign,
      desc: "+20.1% from last month",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      desc: "+180 since last hour",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Active Products",
      value: totalProducts,
      icon: Package,
      desc: "12 products low stock",
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      title: "Customers",
      value: totalCustomers,
      icon: Users,
      desc: "+19 new this week",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];
  // Dummy Data for Traffic Source
  const trafficData = [
    { source: "Direct", percent: 45, color: "#4F46E5" }, // Indigo
    { source: "Social", percent: 30, color: "#06B6D4" }, // Cyan
    { source: "Organic", percent: 15, color: "#F59E0B" }, // Amber
    { source: "Referral", percent: 10, color: "#EC4899" }, // Pink
  ];
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}
              >
                <stat.icon size={22} className={stat.color} />
              </div>
              <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <TrendingUp size={12} className="mr-1" /> 12%
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {stat.value}
              </h3>
              <p className="text-xs text-gray-400 mt-2">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Main Content Grid (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Recent Orders Table (Takes 2 Columns) */}
        {/* --- LEFT COLUMN --- */}
        <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          {/* ✅ ALTERNATIVE: Trending Products (Premium Vibe) */}
          <div>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Zap className="text-yellow-500 fill-yellow-500" size={18} />{" "}
                Trending Now
              </h3>
              <span className="text-xs font-medium text-gray-500">
                Top selling items this week
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trendingProducts.length > 0
                ? trendingProducts.map((product, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-indigo-200 transition-colors group cursor-pointer"
                    >
                      <div className="h-16 w-16 bg-gray-50 rounded-xl relative overflow-hidden shrink-0">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                            Img
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {product.stock > 0
                            ? `${product.stock} in stock`
                            : "Out of stock"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-bold text-indigo-600">
                            ${product.price}
                          </span>
                          <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">
                            24 sales
                          </span>
                        </div>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  ))
                : // Dummy Placeholders if no products
                  [1, 2].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm h-24 animate-pulse"
                    ></div>
                  ))}
            </div>
          </div>

          {/* Recent Transactions Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="font-bold text-gray-900">Recent Transactions</h3>
                <p className="text-xs text-gray-500">
                  Latest orders from your store
                </p>
              </div>
              <Link
                href="/admin/orders"
                className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors flex items-center gap-1 shadow-sm"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50/80 transition-colors group"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        #{order.orderNumber.slice(-6)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-gray-900 font-medium">
                            {order.name || order.user?.name || "Guest"}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border
                          ${
                            order.status === "PENDING"
                              ? "bg-amber-50 text-amber-600 border-amber-100"
                              : order.status === "DELIVERED"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : "bg-gray-50 text-gray-600 border-gray-100"
                          }`}
                        >
                          {order.status.toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-indigo-600 transition-colors p-1.5 hover:bg-indigo-50 rounded-lg">
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Quick Actions / Mini Chart Placeholder (Takes 1 Column) */}
        <div className="space-y-8">
          <div className="space-y-6">
            {/* Widget 1: Traffic Sources (Donut Chart) */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900">Traffic Source</h3>
                <PieChart size={18} className="text-gray-400" />
              </div>

              <div className="flex items-center gap-6">
                {/* CSS Conic Gradient Donut Chart */}
                <div
                  className="h-32 w-32 rounded-full relative shrink-0"
                  style={{
                    background: `conic-gradient(
                            ${trafficData[0].color} 0% 45%, 
                            ${trafficData[1].color} 45% 75%, 
                            ${trafficData[2].color} 75% 90%, 
                            ${trafficData[3].color} 90% 100%
                        )`,
                  }}
                >
                  {/* Inner White Circle to make it a Donut */}
                  <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center flex-col shadow-inner">
                    <span className="text-2xl font-bold text-gray-900">
                      12k
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase">
                      Visits
                    </span>
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-2 flex-1">
                  {trafficData.map((data, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: data.color }}
                        ></span>
                        <span className="text-gray-600">{data.source}</span>
                      </div>
                      <span className="font-bold text-gray-900">
                        {data.percent}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Selling Categories (Dummy Visualization) */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Sales Target</h3>
              <div className="flex items-end gap-2 h-32 mb-4">
                {/* CSS Only Bar Chart */}
                <div className="w-full bg-gray-100 rounded-t-lg h-[40%] hover:bg-indigo-300 transition-colors"></div>
                <div className="w-full bg-gray-100 rounded-t-lg h-[70%] hover:bg-indigo-400 transition-colors"></div>
                <div className="w-full bg-indigo-600 rounded-t-lg h-[100%] shadow-lg shadow-indigo-200"></div>
                <div className="w-full bg-gray-100 rounded-t-lg h-[60%] hover:bg-indigo-300 transition-colors"></div>
                <div className="w-full bg-gray-100 rounded-t-lg h-[80%] hover:bg-indigo-300 transition-colors"></div>
              </div>
              <p className="text-xs text-center text-gray-500">
                Weekly Performance
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
