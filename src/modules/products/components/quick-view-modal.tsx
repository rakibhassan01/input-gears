"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Plus, Minus, Star, Zap } from "lucide-react";
import { useCart } from "@/modules/cart/hooks/use-cart";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { createPortal } from "react-dom";

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    image: string | null;
    description: string | null;
    stock: number;
    slug: string;
    category?: {
      name: string;
    } | null;
    brand?: string | null;
    switchType?: string | null;
  };
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const cart = useCart();
  const { data: session } = useSession();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Close on ESC and manage body scroll
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price);

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      cart.addItem(
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image: product.image || "",
          quantity: quantity,
          maxStock: product.stock,
        },
        !!session,
      );
      setIsAdding(false);
      onClose();
    }, 500);
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-950/40 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row my-auto z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-20 p-2 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-900 hover:text-white transition-all active:scale-90"
            >
              <X size={20} />
            </button>

            {/* Left: Image */}
            <div className="w-full md:w-1/2 bg-gray-50 p-8 flex items-center justify-center min-h-[300px] md:min-h-[500px]">
              <div className="relative w-full aspect-square max-w-[400px]">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-4 drop-shadow-2xl"
                  />
                ) : (
                  <div className="text-gray-300 italic">No Image</div>
                )}
              </div>
            </div>

            {/* Right: Info */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 text-[10px] font-black text-indigo-600 bg-indigo-50 rounded-full uppercase tracking-widest">
                      {product.brand || "Premium Gear"}
                    </span>
                    {product.switchType && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                        <Zap size={10} fill="currentColor" />{" "}
                        {product.switchType}
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                    {product.name}
                  </h2>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-black text-indigo-600">
                      {formattedPrice}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star size={14} fill="currentColor" />
                      <span className="text-sm font-bold text-gray-900">
                        4.8
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-500 text-sm md:text-base leading-relaxed font-medium">
                  {product.description ||
                    "Designed for enthusiasts who demand performance and style. Experience premium tactile feedback and unmatched durability."}
                </p>

                <div className="pt-6 space-y-6">
                  {/* Quantity & Add to Cart */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center p-1 border border-gray-100 rounded-2xl bg-gray-50 w-max">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white text-gray-500 transition disabled:opacity-30"
                      >
                        <Minus size={16} strokeWidth={3} />
                      </button>
                      <span className="w-10 text-center font-black text-gray-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity((q) => Math.min(product.stock, q + 1))
                        }
                        disabled={quantity >= product.stock}
                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white text-gray-500 transition disabled:opacity-30"
                      >
                        <Plus size={16} strokeWidth={3} />
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={isAdding || product.stock === 0}
                      className="flex-1 bg-gray-900 text-white h-[52px] rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all active:scale-95 disabled:bg-gray-200 disabled:cursor-not-allowed shadow-xl shadow-gray-200/50"
                    >
                      <ShoppingCart size={18} strokeWidth={2.5} />
                      {product.stock === 0
                        ? "Sold Out"
                        : isAdding
                          ? "Processing..."
                          : "Add to Cart"}
                    </button>
                  </div>

                  <div className="pt-4 border-t border-gray-50">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Category:{" "}
                      <span className="text-gray-900">
                        {product.category?.name || "Gears"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
};
