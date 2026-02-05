"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/modules/cart/hooks/use-cart";
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
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/modules/products/hooks/use-wishlist";
import { useSession } from "@/lib/auth-client";
import { Product } from "../types";
import { memo, useMemo, useEffect } from "react";
import ProductTabs from "../components/product-tabs";
import RelatedProducts from "../components/related-products";

interface ProductDetailsViewProps {
  product: Product;
  relatedProducts: Product[];
}

const ProductDetailsView = memo(
  ({ product, relatedProducts }: ProductDetailsViewProps) => {
    const cart = useCart();
    const wishlist = useWishlist();
    const { data: session } = useSession();

    const [selectedImage, setSelectedImage] = useState(
      product.images?.[0] || product.image || "/placeholder.png",
    );
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState<string | null>(
      product.colors?.[0] || null,
    );
    const [isAdding, setIsAdding] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      const frame = requestAnimationFrame(() => setIsMounted(true));
      return () => cancelAnimationFrame(frame);
    }, []);

    const isWishlisted = isMounted ? wishlist.isInWishlist(product.id) : false;

    const handleToggleWishlist = () => {
      wishlist.toggleItem(
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image: product.images?.[0] || product.image || "/placeholder.png",
          stock: product.stock,
        },
        !!session,
      );
    };

    const formattedPrice = useMemo(() => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(product.price);
    }, [product.price]);

    const discountedPrice = useMemo(() => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(product.price * 1.2);
    }, [product.price]);

    // Quantity Handlers
    const incrementQty = () =>
      setQuantity((prev) => (prev < product.stock ? prev + 1 : prev));
    const decrementQty = () =>
      setQuantity((prev) => (prev > 1 ? prev - 1 : prev));

    const handleAddToCart = () => {
      setIsAdding(true);

      setTimeout(() => {
        cart.addItem(
          {
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            image: product.images?.[0] || product.image || "/placeholder.png",
            quantity: quantity,
            maxStock: product.stock,
          },
          !!session,
        );

        setIsAdding(false);
      }, 500);
    };

    return (
      <div className="bg-[#fcfcff] min-h-screen">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          {/* --- HERO SECTION: IMAGE & PRIMARY INFO --- */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start mb-20 lg:mb-32">
            {/* --- LEFT: IMAGE GALLERY --- */}
            <div className="flex flex-col gap-6">
              <div className="group relative aspect-square w-full overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 shadow-2xl shadow-gray-200/50">
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  className="object-contain p-8 transition-transform duration-700 group-hover:scale-110"
                  priority
                />
                {/* Badge Overlay */}
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-2 bg-white/80 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm border border-indigo-50/50">
                    New Arrival
                  </span>
                </div>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {(product.images || (product.image ? [product.image] : [])).map(
                  (img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={cn(
                      "relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-300 bg-white",
                      selectedImage === img
                        ? "border-indigo-600 shadow-lg shadow-indigo-200"
                        : "border-transparent hover:border-gray-200 grayscale hover:grayscale-0 opacity-60 hover:opacity-100",
                    )}
                  >
                    <Image
                      src={img}
                      alt="Thumbnail"
                      fill
                      className="object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* --- RIGHT: PRODUCT INFO --- */}
            <div className="mt-10 lg:mt-0 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 text-[10px] font-black text-indigo-600 bg-indigo-50 rounded-full uppercase tracking-tighter">
                      {product.brand || "Input Gears"}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">
                      SKU: {product.sku || "N/A"}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button className="p-3 rounded-2xl bg-white border border-gray-100 text-gray-500 hover:text-indigo-600 hover:shadow-xl hover:shadow-indigo-500/10 transition-all active:scale-95">
                      <Share2 size={18} />
                    </button>
                    <button
                      onClick={handleToggleWishlist}
                      className={cn(
                        "p-3 rounded-2xl bg-white border border-gray-100 transition-all active:scale-95",
                        isWishlisted
                          ? "text-indigo-600 shadow-xl shadow-indigo-500/10 border-indigo-100"
                          : "text-gray-500 hover:text-indigo-600 hover:shadow-xl hover:shadow-indigo-500/10",
                      )}
                    >
                      <Heart
                        size={18}
                        fill={isWishlisted ? "currentColor" : "none"}
                      />
                    </button>
                  </div>
                </div>

                <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight tracking-tight">
                  {product.name}
                </h1>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-900 font-bold">4.8</span>
                    <span className="text-sm text-gray-400 font-medium">
                      (125 Reviews)
                    </span>
                  </div>
                  {product.switchType && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-100">
                      <Zap size={12} fill="currentColor" /> {product.switchType}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 rounded-[2rem] bg-indigo-50/30 border border-indigo-100/50 backdrop-blur-sm shadow-inner space-y-6">
                <div className="flex items-baseline gap-4">
                  <h2 className="text-4xl font-black text-indigo-600 leading-none">
                    {formattedPrice}
                  </h2>
                  <span className="text-xl text-gray-400 line-through font-bold">
                    {discountedPrice}
                  </span>
                  <span className="ml-auto px-3 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                    Save 20%
                  </span>
                </div>

                <p className="text-gray-600 leading-relaxed text-sm lg:text-base font-medium">
                  {product.description?.substring(0, 160)}...
                </p>
              </div>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    Primary Theme <div className="h-px bg-gray-100 flex-1" />
                  </h3>
                  <div className="flex items-center gap-4">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "group relative h-10 w-10 rounded-full border-2 p-1 flex items-center justify-center transition-all duration-300",
                          selectedColor === color
                            ? "border-indigo-600 scale-110 shadow-lg shadow-indigo-100"
                            : "border-transparent hover:scale-105",
                        )}
                        title={color}
                      >
                        <div
                          className="h-full w-full rounded-full transition-transform duration-300 group-hover:scale-90"
                          style={{
                            backgroundColor: color
                              .toLowerCase()
                              .includes("white")
                              ? "#fff"
                              : color.toLowerCase(),
                          }}
                        />
                        {selectedColor === color && (
                          <Check
                            size={12}
                            className={cn(
                              "absolute",
                              color.toLowerCase().includes("white")
                                ? "text-indigo-600"
                                : "text-white",
                            )}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions: Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {/* Quantity */}
                <div className="flex items-center p-1 border border-gray-200 rounded-2xl bg-white shadow-sm w-max">
                  <button
                    onClick={decrementQty}
                    className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-gray-50 text-gray-600 transition disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    <Minus size={18} strokeWidth={3} />
                  </button>
                  <span className="w-12 text-center font-black text-gray-900 text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQty}
                    className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-gray-50 text-gray-600 transition disabled:opacity-30"
                    disabled={quantity >= product.stock}
                  >
                    <Plus size={18} strokeWidth={3} />
                  </button>
                </div>

                {/* Add To Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || product.stock === 0}
                  className="flex-1 bg-gray-900 border-b-4 border-gray-950 text-white h-[60px] rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-indigo-600 hover:border-indigo-700 transition-all duration-300 active:translate-y-1 active:border-b-0 shadow-2xl shadow-gray-200/50 disabled:bg-gray-300 disabled:border-transparent disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={24} strokeWidth={2.5} />
                  {product.stock === 0
                    ? "Out of Stock"
                    : isAdding
                      ? "Adding..."
                      : "Add to Cart"}
                </button>
              </div>

              {/* Extra Info Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="group flex flex-col items-center gap-3 p-5 bg-white rounded-3xl border border-gray-50 shadow-sm transition-all hover:shadow-xl hover:shadow-gray-100 hover:-translate-y-1">
                  <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    <Truck size={20} strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Free Shipping
                  </span>
                </div>
                <div className="group flex flex-col items-center gap-3 p-5 bg-white rounded-3xl border border-gray-50 shadow-sm transition-all hover:shadow-xl hover:shadow-gray-100 hover:-translate-y-1">
                  <div className="w-10 h-10 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300">
                    <RefreshCcw size={20} strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    30 Days Return
                  </span>
                </div>
                <div className="group flex flex-col items-center gap-3 p-5 bg-white rounded-3xl border border-gray-50 shadow-sm transition-all hover:shadow-xl hover:shadow-gray-100 hover:-translate-y-1">
                  <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                    <ShieldCheck size={20} strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Secure Shield
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* --- SECONDARY SECTION: TABS & RELATED PRODUCTS --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-8">
              <ProductTabs product={product} />
            </div>
            <div className="lg:col-span-4 sticky top-10">
              <RelatedProducts products={relatedProducts} />
            </div>
          </div>
        </div>
      </div>
    );
  },
);

ProductDetailsView.displayName = "ProductDetailsView";

export default ProductDetailsView;
