"use client";

import { useCompare, CompareItem } from "@/modules/products/hooks/use-compare";
import { useCart } from "@/modules/cart/hooks/use-cart";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  X, 
  ShoppingCart, 
  ArrowLeftRight, 
  Scale, 
  Maximize2, 
  ChevronRight,
  Plus,
  Zap
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { toast } from "sonner";

export default function CompareView() {
  const compare = useCompare();
  const cart = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const specs = useMemo(() => [
    { key: "brand", label: "Brand" },
    { key: "model", label: "Model" },
    { key: "switchType", label: "Switch Type" },
    { key: "colors", label: "Colors" },
    { key: "material", label: "Material" },
    { key: "connectivity", label: "Connectivity" },
    { key: "battery", label: "Battery Life" },
    { key: "dimensions", label: "Dimensions" },
    { key: "warranty", label: "Warranty" },
  ], []);

  const shouldReduceMotion = useReducedMotion();

  const handleAddToCart = (item: CompareItem) => {
    cart.addItem({
      id: item.id,
      name: item.name,
      slug: item.slug,
      price: item.price,
      image: item.image,
      quantity: 1,
      maxStock: 99, // Should be from data
    });
    toast.success("Added to cart");
  };

  if (!isMounted) return null;

  if (compare.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex p-6 bg-indigo-50 text-indigo-600 rounded-full mb-8">
          <Scale size={48} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-4">
          Compare List is Empty
        </h1>
        <p className="text-gray-500 mb-10 max-w-md mx-auto">
          Start adding items from the store to see their specifications side by side.
        </p>
        <Link 
          href="/products" 
          className="inline-flex items-center gap-2 px-8 py-4 bg-gray-950 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 shadow-xl shadow-gray-200"
        >
          Browse Products <ChevronRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] mb-3">
             <ArrowLeftRight size={14} /> Product Analysis
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-none">
            Comparison <span className="text-indigo-600">Engine</span>
          </h1>
        </div>
        <button 
          onClick={() => compare.clearCompare()}
          className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors flex items-center gap-2"
        >
           Clear All Results
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-0 border border-gray-100 rounded-[40px] bg-white shadow-2xl shadow-gray-200/50 overflow-hidden">
        {/* Row Labels (Desktop only) */}
        <div className="hidden md:flex flex-col border-r border-gray-100 bg-gray-50/50">
          <div className="h-[440px] p-8 flex flex-col justify-end sticky top-0 bg-gray-50/80 backdrop-blur-md z-20 border-b border-gray-100">
             <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2 italic">Parameters</span>
             <h3 className="font-black text-gray-900 uppercase tracking-tight text-xl">Technical Core</h3>
          </div>
          {specs.map((spec) => (
            <div key={spec.key} className="h-24 px-8 flex items-center bg-white border-b border-gray-50">
               <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">{spec.label}</span>
            </div>
          ))}
          <div className="h-32 px-8 flex items-center bg-gray-50/50">
             <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Actions</span>
          </div>
        </div>

        {/* Product Columns */}
        <div className="flex overflow-x-auto no-scrollbar scroll-smooth">
          <AnimatePresence mode="popLayout">
            {compare.items.map((item) => (
              <motion.div 
                key={item.id}
                layout={!shouldReduceMotion}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="min-w-[300px] flex-1 border-r border-gray-50 last:border-r-0"
              >
                {/* Header Info */}
                <div className="h-[440px] p-6 sm:p-8 flex flex-col group sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-100">
                  <div className="flex justify-end mb-4">
                    <button 
                      onClick={() => compare.removeItem(item.id)}
                      className="p-2 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-xl transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="relative aspect-square w-full rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden mb-6 group-hover:shadow-lg transition-all duration-500">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  <Link href={`/products/${item.slug}`}>
                    <h3 className="font-black text-gray-900 uppercase tracking-tighter text-lg mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-indigo-600 text-xl tracking-tight">
                      ${item.price.toFixed(2)}
                    </span>
                    {item.switchType && (
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        {item.switchType}
                      </span>
                    )}
                  </div>
                </div>

                {/* Specs Rows */}
                {specs.map((spec) => (
                  <div key={spec.key} className="h-24 px-6 sm:px-8 flex items-center border-b border-gray-50 bg-white group/row relative">
                    <div className="md:hidden text-[9px] font-black uppercase tracking-widest text-indigo-600/50 mb-1 absolute top-3 left-6 sm:left-8">
                       {spec.label}
                    </div>
                    <div className="pt-4 md:pt-0 w-full">
                      {spec.key === "colors" ? (
                        <div className="flex flex-wrap gap-1.5">
                          {item.colors && item.colors.length > 0 ? (
                            item.colors.map((color: string) => (
                              <div 
                                key={color}
                                className="group/color relative"
                              >
                                <div 
                                  className="w-5 h-5 rounded-full border border-gray-200 shadow-sm transition-transform group-hover/color:scale-125"
                                  style={{ backgroundColor: color.toLowerCase() }}
                                  title={color}
                                />
                                <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-[8px] text-white rounded opacity-0 group-hover/color:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                  {color}
                                </span>
                              </div>
                            ))
                          ) : (
                             <span className="text-gray-300">—</span>
                          )}
                        </div>
                      ) : spec.key === "switchType" ? (
                        <div className="flex">
                           {item.switchType ? (
                             <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-indigo-100">
                               <Zap size={10} /> {item.switchType}
                             </div>
                           ) : (
                             <span className="text-gray-300">—</span>
                           )}
                        </div>
                      ) : (
                        <span className="text-xs sm:text-sm font-bold text-gray-600">
                          {(item.specs as Record<string, string>)?.[spec.key] || (item as unknown as Record<string, string>)[spec.key] || <span className="text-gray-300">—</span>}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {/* Final Actions */}
                <div className="h-32 p-6 sm:p-8 flex items-center gap-3 bg-gray-50/30">
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 bg-gray-950 text-white h-12 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-gray-200"
                  >
                    <ShoppingCart size={16} /> Add to Cart
                  </button>
                  <Link 
                    href={`/products/${item.slug}`}
                    className="h-12 w-12 rounded-xl border border-gray-100 bg-white flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-100 transition-all active:scale-95"
                  >
                    <Maximize2 size={18} />
                  </Link>
                </div>
              </motion.div>
            ))}

            {/* Add More Slot */}
            {compare.items.length < 4 && (
              <div className="min-w-[300px] flex-1 flex flex-col items-center justify-center bg-gray-50/20 border-r border-gray-50 group">
                <Link 
                  href="/products"
                  className="p-8 flex flex-col items-center gap-4 text-center group-hover:scale-105 transition-transform"
                >
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 group-hover:border-indigo-300 group-hover:text-indigo-500 transition-all">
                    <Plus size={24} />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Add Slot</span>
                    <span className="text-xs font-bold text-gray-300">Add another product</span>
                  </div>
                </Link>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-12 p-8 bg-indigo-50 rounded-[32px] border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600">
               <Scale size={24} />
            </div>
            <div>
               <h4 className="font-black text-gray-900 uppercase tracking-tight">Need More help?</h4>
               <p className="text-xs text-gray-500 font-medium italic">Our comparison engine calculates differences based on real specs.</p>
            </div>
         </div>
         <Link 
           href="/products" 
           className="px-6 py-3 bg-white border border-indigo-100 text-[10px] font-black uppercase tracking-widest text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
         >
           Refine Search
         </Link>
      </div>
    </div>
  );
}
