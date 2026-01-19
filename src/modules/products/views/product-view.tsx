import { prisma } from "@/lib/prisma";
import ProductCard from "../components/product-card";
import { Prisma } from "@prisma/client";
import ProductFilters from "../components/product-filters";
import MobileFilters from "../components/mobile-filters";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ProductViewProps {
  filters?: {
    q?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  };
  showFilters?: boolean;
}

export default async function ProductView({
  filters = {},
  showFilters = true,
}: ProductViewProps) {
  const { q, category, brand, minPrice, maxPrice, sort } = filters;

  // Fetch unique categories and brands for filters
  const [categories, uniqueBrands] = await Promise.all([
    prisma.category.findMany({ select: { id: true, name: true } }),
    prisma.product.findMany({
      select: { brand: true },
      distinct: ["brand"],
      where: { brand: { not: null } },
    }),
  ]);

  const brands = uniqueBrands.map((b) => b.brand as string).filter(Boolean);

  // Build Prisma query where clause
  const where: Prisma.ProductWhereInput = {
    AND: [
      q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { sku: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {},
      category ? { category: { name: category } } : {},
      brand ? { brand: brand } : {},
      minPrice || maxPrice
        ? {
            price: {
              ...(minPrice ? { gte: parseFloat(minPrice) } : {}),
              ...(maxPrice ? { lte: parseFloat(maxPrice) } : {}),
            },
          }
        : {},
      { isActive: true },
      {
        OR: [{ scheduledAt: null }, { scheduledAt: { lte: new Date() } }],
      },
    ],
  };

  // Build Prisma query orderBy
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  if (sort === "price_desc") orderBy = { price: "desc" };

  // Fetch filtered products
  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      category: true,
    },
    take: 40,
  });

  return (
    <div className="bg-[#fcfcff] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* --- SIDEBAR: FILTERS (Desktop) --- */}
          {showFilters && (
            <>
              <aside className="hidden lg:block w-80 lg:sticky lg:top-24">
                <div className="p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-2xl shadow-gray-200/40">
                  <ProductFilters categories={categories} brands={brands} />
                </div>
              </aside>
              <MobileFilters categories={categories} brands={brands} />
            </>
          )}

          {/* --- MAIN CONTENT: GRID --- */}
          <main className={cn("flex-1 w-full", !showFilters && "mx-auto")}>
            {/* Header Content */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-1.5 bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.4)]" />
                  <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight uppercase">
                    {q ? (
                      <>
                        Results:{" "}
                        <span className="text-indigo-600">&quot;{q}&quot;</span>
                      </>
                    ) : !showFilters ? (
                      <>
                        Featured <span className="text-indigo-600">Gears</span>
                      </>
                    ) : (
                      <>
                        Advanced <span className="text-indigo-600">Search</span>
                      </>
                    )}
                  </h1>
                </div>
                <p className="text-sm sm:text-base text-gray-400 font-bold ml-4.5">
                  {!showFilters
                    ? "Explore our latest high-performance gadgets."
                    : `Showing ${products.length} products with current filters`}
                </p>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                {category && (
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                    {category}
                  </span>
                )}
                {brand && (
                  <span className="px-3 py-1 bg-violet-50 text-violet-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-violet-100">
                    {brand}
                  </span>
                )}
              </div>
            </div>

            {/* Grid */}
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 px-4 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 text-center animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <SlidersHorizontal size={40} className="text-gray-300" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 uppercase">
                  Empty inventory
                </h3>
                <p className="text-gray-400 mt-2 max-w-xs font-medium px-4">
                  We couldn&apos;t find any products matching your specific
                  advanced filters.
                </p>
                <Link
                  href="/products"
                  className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200"
                >
                  Clear all filters
                </Link>
              </div>
            ) : (
              <div
                className={cn(
                  "grid grid-cols-2 gap-4 lg:gap-8",
                  showFilters
                    ? "lg:grid-cols-2 xl:grid-cols-3 mini:grid-cols-3"
                    : "lg:grid-cols-3 xl:grid-cols-4 mini:grid-cols-4",
                )}
              >
                {products.map((product) => (
                  <ProductCard key={product.id} data={product as any} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
