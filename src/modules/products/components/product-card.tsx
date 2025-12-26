"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

type ProductProps = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category: string;
};

export default function ProductCard({ product }: { product: ProductProps }) {
  const cart = useCart();

  const onAddToCart = () => {
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
      {/* Photo*/}
      <div className="relative h-48 w-full bg-gray-100">
        <Image
          src={product.image || "/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500">{product.category}</p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-indigo-600">
            ৳{product.price}
          </span>
          <Button onClick={onAddToCart} size="sm" className="rounded-full">
            Add <ShoppingCart size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
