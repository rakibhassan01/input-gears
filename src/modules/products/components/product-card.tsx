// components/ProductCard.tsx
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button"; // Shadcn Button
import { ShoppingCart } from "lucide-react"; // Icon
import { MouseEventHandler } from "react";
import { useCart } from "@/hooks/use-cart";

// প্রোডাক্টের টাইপ ডিফাইন করা (টাইপ সেফটির জন্য)
type Product = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const cart = useCart(); // হুক কল করা
  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation(); // কার্ডে ক্লিক করলে যাতে ডিটেইলস পেজে না যায় (যদি লিংক থাকে)

    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };
  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Image Section */}
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        <Image
          src={product.image || "/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {product.category}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm mt-1">Genuine Product</p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-indigo-600">
            ৳{product.price.toLocaleString()}
          </span>
          {/* Button Update */}
          <Button
            onClick={onAddToCart}
            size="sm"
            className="rounded-full gap-2 hover:bg-indigo-700"
          >
            Add <ShoppingCart size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
