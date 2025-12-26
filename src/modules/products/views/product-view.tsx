import { getProducts } from "@/lib/data"; // আপনার বানানো ফাংশন
import ProductCard from "../components/product-card";

export default async function ProductView() {
  const products = await getProducts(); // ডাটাবেস থেকে প্রোডাক্ট আসবে

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* হিরো সেকশন */}
      <section className="bg-gray-900 text-white py-20 text-center px-4">
        <h1 className="text-4xl font-bold mb-2">InputGears ⌨️</h1>
        <p className="text-gray-400">Premium Gear for Developers</p>
      </section>

      {/* প্রোডাক্ট গ্রিড */}
      <div className="max-w-6xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold mb-6">Latest Products</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
