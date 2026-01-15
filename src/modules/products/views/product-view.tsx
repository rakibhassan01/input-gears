import { prisma } from "@/lib/prisma";
import ProductCard from "../components/product-card";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default async function ProductView({
  searchQuery,
}: {
  searchQuery?: string;
}) {
  // ডাটাবেস থেকে প্রোডাক্ট ফেচ করা (Server Component)
  const products = await prisma.product.findMany({
    where: searchQuery
      ? {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { slug: { contains: searchQuery, mode: "insensitive" } },
            { description: { contains: searchQuery, mode: "insensitive" } },
            { category: { name: { contains: searchQuery, mode: "insensitive" } } },
          ],
        }
      : {},
    orderBy: {
      createdAt: "desc",
    },
    take: 20, // সার্চের জন্য একটু বেশি দেখালাম
  });

  return (
    <section className="py-12 bg-gray-50/50">
      <div className="max-w-[1440px]  mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-indigo-600 rounded-full" />
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight uppercase">
                {searchQuery ? (
                  <>
                    Search: <span className="text-indigo-600">&quot;{searchQuery}&quot;</span>
                  </>
                ) : (
                  <>
                    Featured <span className="text-indigo-600">Gears</span>
                  </>
                )}
              </h2>
            </div>
            <p className="text-sm sm:text-base text-gray-500 font-medium">
              {searchQuery 
                ? `Found ${products.length} matching products for your search.`
                : "Explore our latest high-performance gadgets."}
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group transition-all"
          >
            View All Products
            <ChevronRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20 px-4 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">
              No products found in our inventory.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} data={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
