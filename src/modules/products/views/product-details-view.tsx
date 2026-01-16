"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/modules/cart/hooks/use-cart"; // আপনার কার্ট হুক পাথ
import { toast } from "sonner";
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Minus,
  Plus,
  Check,
  Truck,
  ShieldCheck,
  RefreshCcw,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "../types";

interface ProductDetailsViewProps {
  product: Product;
}

export default function ProductDetailsView({
  product,
}: ProductDetailsViewProps) {
  const cart = useCart();

  // States
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors?.[0] || null
  );
  const [isAdding, setIsAdding] = useState(false);

  // Quantity Handlers
  const incrementQty = () =>
    setQuantity((prev) => (prev < product.stock ? prev + 1 : prev));
  const decrementQty = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));

  const handleAddToCart = () => {
    setIsAdding(true);

    setTimeout(() => {
      cart.addItem({
        id: product.id,
        name: product.name,
        // ✅ FIX: Slug যোগ করা হলো (কারণ useCart এ এটি এখন রিকোয়ারড)
        slug: product.slug,
        price: product.price,
        image: product.images[0], // অথবা product.image যদি ট্রান্সফর্ম না করেন
        quantity: quantity,
        maxStock: product.stock,
      });

      toast.success("Added to cart successfully!");
      setIsAdding(false);
    }, 500);
  };
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-start">
        {/* --- LEFT: IMAGE GALLERY --- */}
        <div className="flex flex-col gap-4">
          {/* Main Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 border border-gray-200">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
              priority
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className={cn(
                  "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                  selectedImage === img
                    ? "border-indigo-600 ring-2 ring-indigo-600/20"
                    : "border-transparent hover:border-gray-300"
                )}
              >
                <Image
                  src={img}
                  alt="Thumbnail"
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* --- RIGHT: PRODUCT INFO --- */}
        <div className="mt-10 lg:mt-0 space-y-6">
          {/* Title & Reviews */}
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-block px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-full mb-3">
                {product.category}
              </span>
              <div className="flex gap-2">
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition">
                  <Share2 size={20} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition">
                  <Heart size={20} />
                </button>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <span className="text-sm text-gray-500 font-medium">
                (125 Reviews)
              </span>
              {product.switchType && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-indigo-100">
                  <Zap size={10} /> {product.switchType}
                </div>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-end gap-4">
            <h2 className="text-3xl font-bold text-indigo-600">
              ${product.price.toFixed(2)}
            </h2>
            {/* Fake Discount Logic (Optional) */}
            <span className="text-lg text-gray-400 line-through mb-1">
              ${(product.price * 1.2).toFixed(2)}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed text-base">
            {product.description}
          </p>

          <div className="h-px bg-gray-200 my-6" />

          {/* Selectors (Color & Size) */}
          <div className="space-y-6">
            {/* Colors */}
            {product.colors && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Select Color
                </h3>
                <div className="flex items-center gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all",
                        selectedColor === color
                          ? "border-indigo-600 ring-2 ring-indigo-600/30 scale-110"
                          : "border-transparent hover:scale-110"
                      )}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    >
                      {selectedColor === color && (
                        <Check
                          size={14}
                          className={
                            color.toLowerCase() === "white"
                              ? "text-black"
                              : "text-white"
                          }
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes (Removed as per requirements) */}
          </div>

          {/* Actions: Quantity & Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            {/* Quantity */}
            <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50/50 w-max">
              <button
                onClick={decrementQty}
                className="p-3 hover:text-indigo-600 transition disabled:opacity-50"
                disabled={quantity <= 1}
              >
                <Minus size={18} />
              </button>
              <span className="w-12 text-center font-bold text-gray-900">
                {quantity}
              </span>
              <button
                onClick={incrementQty}
                className="p-3 hover:text-indigo-600 transition disabled:opacity-50"
                disabled={quantity >= product.stock}
              >
                <Plus size={18} />
              </button>
            </div>

            {/* Add To Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isAdding || product.stock === 0}
              className="flex-1 bg-gray-900 text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all active:scale-[0.98] shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={20} />
              {product.stock === 0
                ? "Out of Stock"
                : isAdding
                ? "Adding..."
                : "Add to Cart"}
            </button>
          </div>

          {/* Extra Info Badges */}
          <div className="grid grid-cols-3 gap-4 pt-6 text-center text-xs text-gray-500">
            <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-xl">
              <Truck size={20} className="text-indigo-600" />
              <span>Free Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-xl">
              <RefreshCcw size={20} className="text-indigo-600" />
              <span>30 Days Return</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-xl">
              <ShieldCheck size={20} className="text-indigo-600" />
              <span>Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
