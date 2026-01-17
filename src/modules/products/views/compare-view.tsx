"use client";

import { useCompare, CompareItem } from "@/modules/products/hooks/use-compare";
import { useCart } from "@/modules/cart/hooks/use-cart";
import React, { useEffect, useState, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  ShoppingCart,
  ArrowRight,
  Scale,
  Check,
  Zap,
  Cpu,
  Wifi,
  Box,
  Layers,
  Monitor,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utils ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface SpecGroup {
  id: string;
  name: string;
  icon: React.ElementType;
  keys: { key: string; label: string }[];
}

// --- Helper: Boolean/Null Renderer ---
const SpecValueRenderer = ({ value }: { value: string | number | boolean | null }) => {
  if (value === null || value === undefined || value === "") {
    return <span className="text-slate-300 text-sm">-</span>;
  }
  if (value === "true" || value === true) {
    return (
      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600">
        <Check size={14} strokeWidth={3} />
      </div>
    );
  }
  if (value === "false" || value === false) {
    return (
      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400">
        <X size={14} strokeWidth={3} />
      </div>
    );
  }
  return (
    <span className="text-slate-700 font-medium text-sm md:text-base">
      {String(value)}
    </span>
  );
};

export default function CompareView() {
  const compare = useCompare();
  const cart = useCart();
  const mediaRef = useRef<HTMLDivElement>(null);
  const namesRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [showDiffOnly, setShowDiffOnly] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync horizontal scroll between multiple containers
  const syncScroll = (
    e: React.UIEvent<HTMLDivElement>,
    targets: React.RefObject<HTMLDivElement | null>[]
  ) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    targets.forEach((target) => {
      if (target.current && target.current !== e.currentTarget) {
        target.current.scrollLeft = scrollLeft;
      }
    });
  };

  // --- Data Extraction Logic ---
  const getDisplayValue = (item: CompareItem, key: string) => {
    if (!item) return null;
    const searchKey = key.toLowerCase();

    // 1. Top Level
    const topLevelKey = (Object.keys(item) as Array<keyof CompareItem>).find(
      (k) => k.toString().toLowerCase() === searchKey
    );
    if (topLevelKey) {
      const val = item[topLevelKey];
      if (Array.isArray(val)) return val.length > 0 ? val.join(", ") : null;
      return val;
    }

    // 2. Nested Specs
    if (item.specs) {
      const specs = item.specs as Record<string, string | number | boolean | null>;
      const specKey = Object.keys(specs).find(
        (k) => k.toLowerCase() === searchKey
      );
      if (specKey) {
        const val = specs[specKey];
        if (Array.isArray(val)) return val.length > 0 ? val.join(", ") : null;
        return val;
      }
    }
    return null;
  };

  // --- Configuration ---
  const specGroups = useMemo(() => {
    const groups: SpecGroup[] = [
      {
        id: "essentials",
        name: "Essentials",
        icon: Monitor,
        keys: [
          { key: "brand", label: "Brand" },
          { key: "sku", label: "SKU" },
          { key: "warranty", label: "Warranty" },
          { key: "availability", label: "Availability" },
        ],
      },
      {
        id: "performance",
        name: "Performance",
        icon: Cpu,
        keys: [
          { key: "switchType", label: "Switch Type" },
          { key: "sensor", label: "Sensor" },
          { key: "pollingRate", label: "Polling Rate" },
          { key: "dpi", label: "DPI" },
        ],
      },
      {
        id: "connectivity",
        name: "Connectivity",
        icon: Wifi,
        keys: [
          { key: "connectionType", label: "Connection Type" },
        ],
      },
      {
        id: "build",
        name: "Build & Design",
        icon: Box,
        keys: [
          { key: "colors", label: "Color" },
          { key: "weight", label: "Weight" },
          { key: "description", label: "Description" },
        ],
      },
    ];

    // Dynamic Discovery
    const predefinedKeys = new Set(
      groups.flatMap((g) => g.keys.map((k) => k.key.toLowerCase()))
    );
    const extraKeys = new Set<string>();
    compare.items.forEach((item) => {
      if (item.specs) {
        Object.keys(item.specs).forEach((k) => {
          if (!predefinedKeys.has(k.toLowerCase()))
            extraKeys.add(k.toLowerCase());
        });
      }
    });

    if (extraKeys.size > 0) {
      groups.push({
        id: "additional",
        name: "Other Specs",
        icon: Layers,
        keys: Array.from(extraKeys).map((k) => ({
          key: k,
          label:
            k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, " $1"),
        })),
      });
    }
    return groups;
  }, [compare.items]);

  // --- Logic: Check if row has differences ---
  const rowHasDifferences = (key: string) => {
    if (compare.items.length < 2) return true;
    const values = compare.items.map((item) =>
      String(getDisplayValue(item, key) || "")
    );
    return !values.every((v) => v === values[0]);
  };

  const handleAddToCart = (item: CompareItem) => {
    cart.addItem({
      id: item.id,
      name: item.name,
      slug: item.slug,
      price: item.price,
      image: item.image,
      quantity: 1,
      maxStock: 99,
    });
    toast.success("Added to cart", {
      description: `${item.name} is ready for checkout.`,
      icon: <ShoppingCart className="w-4 h-4" />,
    });
  };

  if (!isMounted) return <div className="min-h-screen bg-slate-50" />;

  // --- Empty State ---
  if (compare.items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-slate-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full"
        >
          <div className="w-24 h-24 mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 flex items-center justify-center mb-8 text-indigo-500">
            <Scale size={40} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
            Compare Mode
          </h1>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Select products from the store to compare tech specs, performance
            metrics, and features side-by-side.
          </p>
          <Link
            href="/products"
            className="inline-flex h-12 items-center justify-center gap-2 px-8 bg-slate-900 text-white rounded-full font-medium transition-all hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95"
          >
            Browse Products <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-slate-50/50 pb-32">
      <div className="max-w-[1600px] mx-auto pt-16 md:pt-24 px-4 md:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-100"
            >
              <Zap size={12} /> Tech Specs
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4"
            >
              Compare Models
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 max-w-2xl text-lg leading-relaxed"
            >
              Analyze hardware specifications, performance benchmarks, and
              feature sets side-by-side to find your perfect match.
            </motion.p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowDiffOnly(!showDiffOnly)}
              className={cn(
                "flex items-center gap-3 px-5 py-2.5 rounded-full border text-sm font-medium transition-all active:scale-95 select-none",
                showDiffOnly
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              )}
            >
              {showDiffOnly ? (
                <ToggleRight size={20} />
              ) : (
                <ToggleLeft size={20} />
              )}
              Highlight Differences
            </button>
          </div>
        </div>

        {/* Comparison Grid Container (Triple Sync Scroll) */}
        <div className="relative border border-slate-200 bg-white rounded-3xl shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col">
          {/* 1. Media & Actions Section (Non-Sticky) */}
          <div
            ref={mediaRef}
            onScroll={(e) => syncScroll(e, [namesRef, contentRef])}
            className="overflow-x-auto no-scrollbar scroll-smooth bg-white border-b border-slate-50"
          >
            <div className="min-w-max md:min-w-full flex">
              <div className="w-[200px] md:w-[280px] shrink-0 p-6 md:p-8 flex flex-col justify-end bg-slate-50/30 border-r border-slate-100">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest leading-none">
                  Overview
                </span>
              </div>

              <div className="flex divide-x divide-slate-100">
                {compare.items.map((item) => (
                  <div
                    key={`${item.id}-media`}
                    className="w-[260px] md:w-[320px] shrink-0 p-6 md:p-8 flex flex-col items-center text-center relative group"
                  >
                    <button
                      onClick={() => compare.removeItem(item.id)}
                      className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors p-2"
                    >
                      <X size={18} />
                    </button>

                    <div className="relative w-full aspect-square mb-6">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="mt-auto w-full space-y-3">
                      <div className="text-2xl font-bold text-slate-900">
                        ${item.price.toLocaleString()}
                      </div>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200 active:scale-95"
                      >
                        <ShoppingCart size={16} /> Add
                      </button>
                    </div>
                  </div>
                ))}
                
                {compare.items.length < 4 && (
                   <div className="w-[260px] md:w-[320px] shrink-0 bg-slate-50/10 border-l border-slate-100" />
                )}
              </div>
            </div>
          </div>

          {/* 2. Product Names Row (Sticky) */}
          <div
            ref={namesRef}
            onScroll={(e) => syncScroll(e, [mediaRef, contentRef])}
            className="overflow-x-auto no-scrollbar scroll-smooth sticky top-[64px] md:top-[72px] z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm"
          >
            <div className="min-w-max md:min-w-full flex">
              <div className="w-[200px] md:w-[280px] shrink-0 p-4 md:p-6 flex items-center bg-white border-r border-slate-200 sticky left-0 z-50 shadow-[4px_0_20px_rgba(0,0,0,0.05)]">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest leading-none">
                  {compare.items.length} Products
                </span>
              </div>

              <div className="flex divide-x divide-slate-100">
                {compare.items.map((item) => (
                  <div
                    key={`${item.id}-name`}
                    className="w-[260px] md:w-[320px] shrink-0 px-6 py-4 md:px-8 md:py-6 flex flex-col justify-center text-center"
                  >
                    <Link
                      href={`/products/${item.slug}`}
                      className="hover:text-indigo-600 transition-colors w-full"
                    >
                      <h3 className="text-sm md:text-base font-black text-slate-900 leading-tight line-clamp-2 h-10 md:h-12 flex items-center justify-center">
                        {item.name}
                      </h3>
                    </Link>
                  </div>
                ))}

                {compare.items.length < 4 && (
                  <div className="w-[260px] md:w-[320px] shrink-0 flex items-center justify-center bg-slate-50/50 border-l border-slate-200">
                     <Link
                      href="/products"
                      className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      <ArrowRight size={14} /> Add Product
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Specs Content */}
          <div
            ref={contentRef}
            onScroll={(e) => syncScroll(e, [mediaRef, namesRef])}
            className="overflow-x-auto no-scrollbar scroll-smooth"
          >
            <div className="min-w-max md:min-w-full">
              <div className="divide-y divide-slate-100">
                {specGroups.map((group) => {
                  const visibleKeys = showDiffOnly
                    ? group.keys.filter((k) => rowHasDifferences(k.key))
                    : group.keys;

                  if (visibleKeys.length === 0) return null;

                  return (
                    <div key={group.id} className="flex flex-col">
                      <div className="md:hidden bg-slate-50 px-6 py-3 border-y border-slate-100 flex items-center gap-2 text-slate-500">
                        <group.icon size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          {group.name}
                        </span>
                      </div>

                      {visibleKeys.map((spec) => {
                        const isDiff = rowHasDifferences(spec.key);
                        const isHovered = hoveredRow === spec.key;

                        return (
                          <div
                            key={spec.key}
                            onMouseEnter={() => setHoveredRow(spec.key)}
                            onMouseLeave={() => setHoveredRow(null)}
                            className={cn(
                              "flex transition-colors duration-200",
                              isHovered ? "bg-indigo-50/40" : "bg-white",
                              !isDiff && showDiffOnly ? "opacity-30 grayscale" : "opacity-100"
                            )}
                          >
                            <div className="w-[200px] md:w-[280px] shrink-0 p-4 pl-6 md:pl-8 flex items-center border-r border-slate-100/50 sticky left-0 z-30 bg-white shadow-[2px_0_8px_rgba(0,0,0,0.02)]">
                              <div className="flex flex-col">
                                <span className={cn(
                                  "text-[13px] md:text-sm font-medium transition-colors",
                                  isHovered ? "text-indigo-900" : "text-slate-500"
                                )}>
                                  {spec.label}
                                </span>
                                <span className="text-[9px] md:text-[10px] text-slate-300 font-bold uppercase tracking-wider mt-0.5">
                                  {group.name}
                                </span>
                              </div>
                            </div>

                            <div className="flex divide-x divide-slate-100/50">
                              {compare.items.map((item) => {
                                const val = getDisplayValue(item, spec.key);
                                return (
                                  <div
                                    key={`${item.id}-${spec.key}`}
                                    className="w-[260px] md:w-[320px] shrink-0 p-4 md:p-5 flex items-center justify-center md:justify-start text-center md:text-left"
                                  >
                                    {spec.key === "colors" && Array.isArray(val) ? (
                                      <div className="flex gap-1.5 justify-center md:justify-start flex-wrap">
                                        {val.map((c: string) => (
                                          <div
                                            key={c}
                                            className="w-5 h-5 rounded-full border border-slate-200 shadow-sm"
                                            style={{ backgroundColor: c.toLowerCase() }}
                                            title={c}
                                          />
                                        ))}
                                      </div>
                                    ) : (
                                      <SpecValueRenderer value={val as string | number | boolean | null} />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        {compare.items.length > 0 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => {
                compare.clearCompare();
                toast("Comparison cleared");
              }}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors text-sm font-medium"
            >
              <Trash2 size={16} /> Clear Comparison Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
