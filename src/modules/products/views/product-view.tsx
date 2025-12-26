import { getProducts } from "@/lib/data";
import Link from "next/link";
import ProductCard from "../components/product-card";

export default async function ProductView() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-indigo-900 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Level Up Your Setup 🚀
          </h1>
          <p className="text-indigo-200 text-lg mb-8">
            Premium Mechanical Keyboards, Mice & Accessories.
          </p>
          <Link href="#products">
            <button className="bg-white text-indigo-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition">
              Shop Now
            </button>
          </Link>
        </div>
      </section>

      {/* Product Grid Section */}
      <section id="products" className="max-w-6xl mx-auto py-16 px-4">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Latest Arrivals 🔥
          </h2>
          <span className="text-gray-500">
            {products.length} Products Found
          </span>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
