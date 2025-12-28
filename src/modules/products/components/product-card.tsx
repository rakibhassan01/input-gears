"use client";

import Image from "next/image";
import Link from "next/link"; // ✅ Link ইমপোর্ট
import { ShoppingCart, Check } from "lucide-react";
import { useCart, CartItem } from "@/modules/cart/hooks/use-cart";
import { MouseEventHandler, useState, useEffect } from "react";

interface ProductCardProps {
  data: {
    id: string;
    name: string;
    price: number;
    image: string | null;
    description: string | null;
    stock: number;
    slug: string;
  };
}

export default function ProductCard({ data }: ProductCardProps) {
  const cart = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const isOutOfStock = data.stock === 0;

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isAdded) {
      timeout = setTimeout(() => setIsAdded(false), 1000);
    }
    return () => clearTimeout(timeout);
  }, [isAdded]);

  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    // ✅ বাটন ক্লিকের ইভেন্ট বাবদ বন্ধ করা (যাতে Link কাজ না করে বাটনে চাপলে)
    event.preventDefault();
    event.stopPropagation();

    const cartItem: CartItem = {
      id: data.id,
      name: data.name,
      slug: data.slug, // ✅ Slug পাস করা হলো
      price: data.price,
      image: data.image || "",
      quantity: 1,
      maxStock: data.stock,
    };

    cart.addItem(cartItem);
    setIsAdded(true);
  };

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(data.price);

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-indigo-200 overflow-hidden flex flex-col h-full">
      {/* ✅ LINK ADDED: পুরো ইমেজ এরিয়া ক্লিকেবল হবে */}
      <Link
        href={`/products/${data.slug}`}
        className="block aspect-square relative bg-gray-100/50 overflow-hidden"
      >
        {data.image ? (
          <Image
            src={data.image}
            alt={data.name}
            fill
            className={`object-cover transition-transform duration-700 ${
              isOutOfStock ? "opacity-50" : "group-hover:scale-105"
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 font-medium bg-gray-50">
            No Image
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-red-500/90 text-white px-4 py-1.5 text-xs font-bold rounded-full shadow-sm tracking-wider">
              SOLD OUT
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col grow justify-between">
        <div>
          {/* ✅ LINK ADDED: টাইটেল ক্লিকেবল হবে */}
          <Link href={`/products/${data.slug}`}>
            <h3 className="font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors text-lg tracking-tight">
              {data.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1.5 leading-relaxed">
            {data.description || "No description available."}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
              Price
            </span>
            <span className="font-extrabold text-xl text-gray-900 leading-none">
              {formattedPrice}
            </span>
          </div>

          <button
            onClick={onAddToCart}
            disabled={isOutOfStock}
            className={`
                h-11 w-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm active:scale-95 z-10
                ${
                  isOutOfStock
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed shadow-none border border-gray-200"
                    : isAdded
                    ? "bg-green-500 text-white shadow-green-200 scale-110"
                    : "bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700 hover:shadow-md group-hover:scale-110"
                }
            `}
          >
            {isAdded ? (
              <Check
                size={20}
                strokeWidth={3}
                className="animate-in fade-in zoom-in duration-300"
              />
            ) : (
              <ShoppingCart
                size={20}
                strokeWidth={2.5}
                className="transition-transform duration-300"
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
