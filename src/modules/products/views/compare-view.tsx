"use client";

import { useCompare, CompareItem } from "@/modules/products/hooks/use-compare";
import { useCart } from "@/modules/cart/hooks/use-cart";
import { useEffect, useState, useMemo } from "react";
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
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
const SpecValueRenderer = ({ value }: { value: string | boolean | null }) => {
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
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [showDiffOnly, setShowDiffOnly] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      const specsRecord = item.specs as Record<string, any>;
      const specKey = Object.keys(specsRecord).find(
        (k) => k.toLowerCase() === searchKey
      );
      if (specKey) {
        const val = specsRecord[specKey];
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
          { key: "model", label: "Model" },
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
          { key: "battery", label: "Battery Life" },
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
    // check if all values in the array are identical
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
          <div className="flex items-center gap-1.5 justify-center md:justify-start">
            <AlertCircle size={14} className="text-slate-300" />
            <span className="text-slate-300 italic text-[13px]">
              Telemetry Unavailable
            </span>
          </div>
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
      {/* Sticky Top Bar (Glassmorphism) */}
      <motion.div
        className={cn(
          "fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 transition-all duration-300",
          isScrolled
            ? "translate-y-0 opacity-100 shadow-sm"
            : "-translate-y-full opacity-0"
        )}
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-20 flex items-center">
          <div className="w-[200px] md:w-[280px] shrink-0 font-bold text-slate-900 flex items-center gap-2">
            <Scale className="text-indigo-600" size={20} />
            <span>Comparison</span>
            <span className="text-slate-400 font-normal text-sm ml-2 hidden sm:inline-block">
              {compare.items.length} items
            </span>
          </div>
          <div className="flex-1 flex items-center gap-4 overflow-x-auto no-scrollbar mask-gradient-right">
            {compare.items.map((item) => (
              <div
                key={item.id}
                className="min-w-[200px] flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 relative overflow-hidden shrink-0 border border-slate-200">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-900 truncate block max-w-[120px]">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    ${item.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="pl-4 border-l border-slate-200 hidden md:block">
            <button
              onClick={() => compare.clearCompare()}
              className="text-xs font-semibold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
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

        {/* Comparison Grid */}
        <div className="relative border border-slate-200 bg-white rounded-3xl shadow-xl shadow-slate-200/40 overflow-hidden">
          {/* Grid Header (Products) */}
          <div className="flex border-b border-slate-100">
            {/* Spacer for sticky sidebar */}
            <div className="hidden md:flex w-[280px] shrink-0 p-8 flex-col justify-end bg-slate-50/50 border-r border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {compare.items.length} Products
              </span>
            </div>

            {/* Product Columns */}
            <div className="flex overflow-x-auto no-scrollbar divide-x divide-slate-100 w-full scroll-smooth">
              {compare.items.map((item) => (
                <div
                  key={item.id}
                  className="min-w-[260px] md:min-w-[320px] flex-1 p-6 md:p-8 flex flex-col items-center text-center relative group"
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

                  <Link
                    href={`/products/${item.slug}`}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2 line-clamp-2 min-h-[3rem]">
                      {item.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2 mb-6">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      {getDisplayValue(item, "brand")}
                    </span>
                    {item.specs?.["new"] && (
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        New
                      </span>
                    )}
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

              {/* Add Slot */}
              {compare.items.length < 4 && (
                <div className="min-w-[200px] flex-1 flex flex-col items-center justify-center p-8 bg-slate-50/30 border-dashed border-l border-slate-200 hover:bg-slate-50 transition-colors">
                  <Link
                    href="/products"
                    className="group flex flex-col items-center gap-4"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-300 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-all">
                      <ArrowRight size={24} />
                    </div>
                    <span className="text-sm font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                      Add Product
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Spec Rows */}
          <div className="divide-y divide-slate-100">
            {specGroups.map((group) => {
              // Filter keys if diff mode is on
              const visibleKeys = showDiffOnly
                ? group.keys.filter((k) => rowHasDifferences(k.key))
                : group.keys;

              if (visibleKeys.length === 0) return null;

              return (
                <div key={group.id} className="flex flex-col">
                  {/* Group Header (Mobile) */}
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
                          "flex flex-col md:flex-row transition-colors duration-200",
                          isHovered ? "bg-indigo-50/40" : "bg-white",
                          !isDiff && showDiffOnly
                            ? "opacity-30 grayscale"
                            : "opacity-100"
                        )}
                      >
                        {/* Label Column */}
                        <div className="hidden md:flex w-[280px] shrink-0 p-4 pl-8 items-center border-r border-slate-100/50">
                          <div className="flex flex-col">
                            <span
                              className={cn(
                                "text-sm font-medium transition-colors",
                                isHovered ? "text-indigo-900" : "text-slate-500"
                              )}
                            >
                              {spec.label}
                            </span>
                            {/* Group Context (Subtle) */}
                            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider mt-0.5">
                              {group.name}
                            </span>
                          </div>
                        </div>

                        {/* Value Columns */}
                        <div className="flex overflow-x-auto no-scrollbar divide-x divide-slate-100/50 w-full">
                          {compare.items.map((item) => {
                            const val = getDisplayValue(item, spec.key);

                            return (
                              <div
                                key={`${item.id}-${spec.key}`}
                                className="min-w-[260px] md:min-w-[320px] flex-1 p-4 md:p-5 flex items-center justify-center md:justify-start text-center md:text-left"
                              >
                                {/* Mobile Label */}
                                <span className="md:hidden text-xs text-slate-400 mr-2">
                                  {spec.label}:
                                </span>

                                {spec.key === "colors" && Array.isArray(val) ? (
                                  <div className="flex gap-1.5 justify-center md:justify-start flex-wrap">
                                    {val.map((c: string) => (
                                      <div
                                        key={c}
                                        className="w-5 h-5 rounded-full border border-slate-200 shadow-sm"
                                        style={{
                                          backgroundColor: c.toLowerCase(),
                                        }}
                                        title={c}
                                      />
                                    ))}
                                  </div>
                                ) : (
                                  <SpecValueRenderer value={val as string} />
                                )}
                              </div>
                            );
                          })}
                          {/* Spacer for empty slot */}
                          {compare.items.length < 4 && (
                            <div className="min-w-[200px] flex-1" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
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
