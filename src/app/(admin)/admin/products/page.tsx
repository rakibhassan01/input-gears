import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import {
  Plus,
  Filter,
  Edit,
  Trash2,
  Eye,
  ArrowUpDown,
  Package,
  AlertTriangle,
  DollarSign,
  Box,
} from "lucide-react";
import AdminSearch from "@/modules/admin/components/admin-search";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  // ১. প্যারালাল ডাটা ফেচিং
  const [products, totalCount, lowStockCount] = await Promise.all([
    prisma.product.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { slug: { contains: q, mode: "insensitive" } },
            ],
          }
        : {},
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count(),
    prisma.product.count({
      where: { stock: { lte: 10 } }, // ১০ এর নিচে স্টক থাকলে Low Stock
    }),
  ]);

  // Inventory Value Calculation
  const inventoryValue = products.reduce(
    (acc, item) => acc + item.price * item.stock,
    0
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">
            Manage your store&apos;s inventory and catalog.
          </p>
        </div>
        <Link
          href="/admin/products/create"
          className="inline-flex items-center gap-2 bg-gray-900 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm active:scale-95"
        >
          <Plus size={18} /> Add Product
        </Link>
      </div>

      {/* 2. Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Package size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Total Products
            </p>
            <h3 className="text-2xl font-bold text-gray-900">{totalCount}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Inventory Value
            </p>
            <h3 className="text-2xl font-bold text-gray-900">
              ${inventoryValue.toLocaleString()}
            </h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div
            className={`p-3 rounded-xl ${
              lowStockCount > 0
                ? "bg-orange-50 text-orange-600"
                : "bg-gray-50 text-gray-400"
            }`}
          >
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Low Stock Items
            </p>
            <h3 className="text-2xl font-bold text-gray-900">
              {lowStockCount}
            </h3>
          </div>
        </div>
      </div>

      {/* 3. Main Product Table Wrapper */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* A. Toolbar (Search & Filter) */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
          {/* Search */}
          <AdminSearch placeholder="Search by name, SKU..." />

          {/* Filters */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter size={16} /> Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <ArrowUpDown size={16} /> Sort
            </button>
          </div>
        </div>

        {/* B. The Table */}
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 w-16">Image</th>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock Status</th>
                  <th className="px-6 py-4">Last Updated</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => {
                  // Stock Status Logic
                  let stockStatus = {
                    label: "In Stock",
                    color: "bg-green-50 text-green-700 border-green-200",
                  };
                  if (product.stock === 0)
                    stockStatus = {
                      label: "Out of Stock",
                      color: "bg-red-50 text-red-700 border-red-200",
                    };
                  else if (product.stock <= 10)
                    stockStatus = {
                      label: "Low Stock",
                      color: "bg-orange-50 text-orange-700 border-orange-200",
                    };

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50/80 transition-colors group"
                    >
                      {/* Image */}
                      <td className="px-6 py-4">
                        <div className="h-12 w-12 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden relative">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <Box size={20} />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Name */}
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">
                          {product.description || "No description"}
                        </p>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </td>

                      {/* Stock Status Badge */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${stockStatus.color}`}
                        >
                          {product.stock} units • {stockStatus.label}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {new Date(product.updatedAt).toLocaleDateString()}
                      </td>

                      {/* Actions (Hover Reveal) */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Live"
                          >
                            <Eye size={18} />
                          </Link>
                          <Link
                            href={`/admin/products/edit/${product.id}`}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Box size={40} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              No products found
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto mt-2 mb-6">
              Get started by creating your first product. It will show up here
              once published.
            </p>
            <Link
              href="/admin/products/create"
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              Create Product
            </Link>
          </div>
        )}

        {/* C. Pagination Footer (Static for now) */}
        {products.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-bold text-gray-900">{products.length}</span>{" "}
              of <span className="font-bold text-gray-900">{totalCount}</span>{" "}
              products
            </p>
            <div className="flex gap-2">
              <button
                disabled
                className="px-4 py-2 text-sm font-medium text-gray-400 bg-white border border-gray-200 rounded-lg cursor-not-allowed"
              >
                Previous
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
