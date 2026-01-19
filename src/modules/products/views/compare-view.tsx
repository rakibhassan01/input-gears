"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  X,
  Check,
  Cpu,
  Wifi,
  Box,
  Layers,
  Monitor,
  Share2,
  Plus,
  Scale,
  ChevronDown,
} from "lucide-react";
import { useCompare, CompareItem } from "@/modules/products/hooks/use-compare";
import { useCart } from "@/modules/cart/hooks/use-cart";
import { useSession } from "@/lib/auth-client";

// --- Utils ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Configuration & Types ---
interface SpecGroup {
  id: string;
  name: string;
  icon: React.ElementType;
  keys: { key: string; label: string; info?: string }[];
}

const STATIC_GROUPS: SpecGroup[] = [
  {
    id: "essentials",
    name: "Essentials",
    icon: Monitor,
    keys: [
      { key: "brand", label: "Brand" },
      { key: "sku", label: "SKU" },
      { key: "warranty", label: "Warranty" },
      { key: "availability", label: "Status" },
    ],
  },
  {
    id: "performance",
    name: "Performance",
    icon: Cpu,
    keys: [
      { key: "switchType", label: "Switch" },
      { key: "sensor", label: "Sensor" },
      { key: "pollingRate", label: "Polling" },
      { key: "dpi", label: "DPI" },
    ],
  },
  {
    id: "connectivity",
    name: "Connectivity",
    icon: Wifi,
    keys: [{ key: "connectionType", label: "Interface" }],
  },
  {
    id: "build",
    name: "Build",
    icon: Box,
    keys: [
      { key: "colors", label: "Colors" },
      { key: "weight", label: "Weight" },
      { key: "description", label: "Overview" },
    ],
  },
];

const SpecValueRenderer = ({
  value,
  isDiff,
}: {
  value: string | number | boolean | null | undefined | string[];
  isDiff: boolean;
}) => {
  if (value === null || value === undefined || value === "") {
    return <span className="text-zinc-200 text-sm">-</span>;
  }

  if (value === "true" || value === true) {
    return (
      <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-zinc-900 text-white shadow-sm">
        <Check size={10} strokeWidth={4} />
      </div>
    );
  }
  if (value === "false" || value === false) {
    return (
      <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-zinc-100 text-zinc-300">
        <X size={10} strokeWidth={4} />
      </div>
    );
  }

  return (
    <span
      className={cn(
        "text-xs transition-all duration-300",
        isDiff ? "text-zinc-950 font-semibold" : "text-zinc-500 font-normal",
      )}
    >
      {String(value)}
    </span>
  );
};

export default function CompareView() {
  const compare = useCompare();
  const cart = useCart();
  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<
    Record<string, boolean>
  >({});
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 250);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const specGroups = useMemo(() => {
    const groups = [...STATIC_GROUPS];
    const extraKeys = new Set<string>();
    const predefinedKeys = new Set(
      STATIC_GROUPS.flatMap((g) => g.keys.map((s) => s.key.toLowerCase())),
    );

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
        name: "Technical",
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

  const getDisplayValue = (
    item: CompareItem,
    key: string,
  ): string | number | boolean | null | undefined => {
    if (!item) return null;
    const searchKey = key.toLowerCase();
    const topLevelKey = (Object.keys(item) as Array<keyof CompareItem>).find(
      (k) => k.toString().toLowerCase() === searchKey,
    );
    if (topLevelKey) {
      const val = item[topLevelKey];
      return Array.isArray(val)
        ? val.length > 0
          ? val.join(", ")
          : null
        : (val as string | number | boolean | null | undefined);
    }
    if (item.specs) {
      const specs = item.specs as Record<string, string | number | boolean>;
      const specKey = Object.keys(specs).find(
        (k) => k.toLowerCase() === searchKey,
      );
      if (specKey) return specs[specKey];
    }
    return null;
  };

  const rowHasDifferences = (key: string) => {
    if (compare.items.length < 2) return false;
    const values = compare.items.map((item) =>
      String(getDisplayValue(item, key) || ""),
    );
    return !values.every((v) => v === values[0]);
  };

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied", {
        style: { background: "#000", color: "#fff", borderRadius: "12px" },
      });
    }
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
    }, !!session);
  };

  if (!isMounted) return null;

  if (compare.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-zinc-50/50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[24px_24px] opacity-20" />
        <div className="text-center max-w-sm relative z-10">
          <div className="w-16 h-16 bg-zinc-950 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-white shadow-2xl">
            <Scale size={24} />
          </div>
          <h1 className="text-3xl font-black text-zinc-950 mb-3 tracking-tighter italic">
            EMPTY RACK.
          </h1>
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.4em] mb-10">
            Select gears to begin comparison
          </p>
          <Link
            href="/products"
            className="inline-flex h-12 items-center px-10 bg-zinc-950 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-zinc-100"
          >
            Browse Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-32 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-zinc-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-zinc-50 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 opacity-40 pointer-events-none" />

      {/* Scroll-only Sticky Header - Floating Version */}
      <div
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 z-100 w-[95%] max-w-[1400px] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] transform",
          isScrolled ? "translate-y-0 opacity-100 scale-100" : "-translate-y-20 opacity-0 scale-95"
        )}
      >
        <div className="bg-white/80 backdrop-blur-3xl border border-zinc-200/50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] rounded-[1.5rem] lg:rounded-[2rem] h-14 lg:h-20 flex items-center px-4 lg:px-12">
          <div className="w-[40px] lg:w-[280px] shrink-0 flex items-center gap-4">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-zinc-950 rounded-xl flex items-center justify-center text-white shadow-xl shadow-zinc-200">
              <Scale size={14} className="lg:size-16" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-950 hidden lg:block">Comparison</span>
          </div>
          <div className="flex-1 flex gap-4 lg:gap-14 overflow-hidden border-l border-zinc-100 pl-4 lg:pl-16">
            {compare.items.map((item) => (
              <div
                key={`scrolled-${item.id}`}
                className="flex items-center gap-3 lg:gap-5 min-w-[150px] lg:min-w-[220px]"
              >
                <div className="relative w-8 h-8 lg:w-12 lg:h-12 bg-white rounded-xl p-1 shadow-sm border border-zinc-50 shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] lg:text-xs font-bold text-zinc-950 truncate tracking-tight uppercase">
                    {item.name}
                  </p>
                  <p className="text-[9px] lg:text-[10px] font-medium text-zinc-400 tracking-tight">
                    ${item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto pt-20 px-4 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-28">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-4"
            >
              <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-[0.2em]">
                {compare.items.length} Products
              </span>
            </motion.div>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-zinc-950 tracking-tight leading-tight">
              Compare
              <span className="text-zinc-300">.</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-zinc-950 transition-all active:scale-95"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={() => compare.clearCompare()}
              className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-950 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto select-none no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="p-6 sm:p-10 text-left w-[150px] sm:w-[200px] lg:w-[280px] align-top">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-zinc-950 uppercase tracking-widest">
                      Specifications
                    </span>
                    <div className="h-0.5 w-6 bg-zinc-950" />
                  </div>
                </th>
                {compare.items.map((item, idx) => (
                  <th
                    key={item.id}
                    className="p-6 sm:p-10 text-left min-w-[240px] sm:min-w-[300px] lg:min-w-[360px] group border-l border-zinc-50 first:border-l-0"
                  >
                    <div className="flex flex-col gap-6 sm:gap-10">
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: idx * 0.1,
                          type: "spring",
                          stiffness: 80,
                        }}
                        className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 bg-zinc-50/50 rounded-[2rem] sm:rounded-[3rem] p-4 sm:p-8 border border-zinc-100/50 transition-all duration-700 group-hover:bg-white group-hover:shadow-[0_48px_80px_-20px_rgba(0,0,0,0.08)] group-hover:-translate-y-3"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-4 group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
                        />
                        <button
                          onClick={() => compare.removeItem(item.id)}
                          className="absolute -top-3 -right-3 w-10 h-10 bg-white border border-zinc-100 text-zinc-950 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-zinc-950 hover:text-white hover:scale-110 shadow-xl"
                        >
                          <X size={16} strokeWidth={3} />
                        </button>
                      </motion.div>
                      <div className="space-y-4">
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-950 tracking-tight leading-none">
                          {item.name}
                        </h3>
                        <div className="flex items-end justify-between gap-4">
                          <span className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight">
                            ${item.price}
                          </span>
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="text-[10px] font-bold uppercase tracking-widest text-zinc-950 underline underline-offset-4 hover:text-zinc-500 transition-colors"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </th>
                ))}
                {compare.items.length < 4 && (
                  <th className="p-10 align-top">
                    <Link
                      href="/products"
                      className="flex flex-col items-center justify-center aspect-square lg:h-48 border border-zinc-100 rounded-3xl hover:border-zinc-950 hover:bg-zinc-50 group transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300 group-hover:bg-zinc-950 group-hover:text-white transition-all mb-4">
                        <Plus size={18} />
                      </div>
                      <span className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-950 uppercase tracking-widest">
                        Add Unit
                      </span>
                    </Link>
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-50">
              {specGroups.map((group) => (
                <React.Fragment key={group.id}>
                  <tr
                    className="bg-zinc-50/30 border-b border-white cursor-pointer group/group-header transition-colors hover:bg-zinc-50"
                    onClick={() => toggleGroup(group.id)}
                  >
                    <td className="p-4 sm:p-8 px-6 sm:px-12">
                      <div className="flex items-center gap-4 sm:gap-6">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-zinc-950 text-white flex items-center justify-center shadow-lg shadow-zinc-200">
                          <group.icon size={14} className="sm:size-16" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-950">
                            {group.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td
                      colSpan={compare.items.length + 1}
                      className="p-4 sm:p-8 text-right pr-6 sm:pr-20"
                    >
                      <div className="inline-flex items-center gap-3 sm:gap-4 text-zinc-300 group-hover/group-header:text-zinc-950 transition-colors">
                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em]">
                          {collapsedGroups[group.id] ? "Expand" : "Collapse"}
                        </span>
                        <ChevronDown
                          size={16}
                          strokeWidth={3}
                          className={cn(
                            "transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] w-3.5 h-3.5 sm:w-4 sm:h-4",
                            !collapsedGroups[group.id] && "rotate-180",
                          )}
                        />
                      </div>
                    </td>
                  </tr>

                  <AnimatePresence mode="wait">
                    {!collapsedGroups[group.id] &&
                      group.keys.map((spec) => (
                        <motion.tr
                          key={spec.key}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="group/row border-b border-zinc-50 hover:bg-zinc-50/20 transition-all"
                        >
                          <td className="bg-white p-4 sm:p-8 px-6 sm:px-16 transition-all">
                            <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 group-hover/row:text-zinc-950 transition-colors">
                              {spec.label}
                            </span>
                          </td>
                          {compare.items.map((item) => (
                            <td
                              key={`${item.id}-${spec.key}`}
                              className="p-4 sm:p-8 px-6 sm:px-12 align-middle border-l border-zinc-50/30 first:border-l-0"
                            >
                              <SpecValueRenderer
                                value={getDisplayValue(item, spec.key)}
                                isDiff={rowHasDifferences(spec.key)}
                              />
                            </td>
                          ))}
                          {compare.items.length < 4 && <td className="p-8" />}
                        </motion.tr>
                      ))}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
