import { prisma } from "@/lib/prisma";
import ProductCard from "../components/product-card";

export default async function ProductView() {
  // ডাটাবেস থেকে প্রোডাক্ট ফেচ করা (Server Component)
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 12, // প্রথমে ১০-১২ টা দেখালাম
  });

  return (
    <section className="py-12 bg-gray-50/50">
      <div className="max-w-[1440px]  mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Featured Products
            </h2>
            <p className="text-gray-500 mt-2">
              Explore our latest gadgets and gears.
            </p>
          </div>
          {/* Filter/Sort বাটন এখানে যোগ করা যাবে */}
        </div>

        {/* Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} data={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
