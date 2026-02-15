"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  ShoppingCart,
  Zap,
  Box,
  Cpu,
  Wifi,
  Layers,
  ChevronDown,
} from "lucide-react";
import { useCompare, CompareItem } from "@/modules/products/hooks/use-compare";
import { useCart } from "@/modules/cart/hooks/use-cart";
import { useSession } from "@/lib/auth-client";

// --- Utils ---
function cn(...inputs: (string | boolean | undefined)[]) {
  return inputs.filter(Boolean).join(" ");
}

// --- Configuration ---
interface SpecGroup {
  id: string;
  name: string;
  icon: React.ElementType;
  keys: { key: string; label: string }[];
}

const STATIC_GROUPS: SpecGroup[] = [
  {
    id: "connectivity",
    name: "Networking & Connectivity",
    icon: Wifi,
    keys: [
      { key: "connectivity", label: "Connectivity" },
      { key: "bluetooth", label: "Bluetooth" },
    ],
  },
  {
    id: "audio",
    name: "Audio & Microphone",
    icon: Zap,
    keys: [
      { key: "noiseCancelling", label: "Noise Cancelling" },
      { key: "audioTechnology", label: "Audio Technology" },
    ],
  },
  {
    id: "battery",
    name: "Battery And Power",
    icon: Box,
    keys: [
      { key: "chargingPort", label: "Charging port" },
      { key: "playbackTime", label: "Playback Time" },
    ],
  },
  {
    id: "others",
    name: "Others",
    icon: Layers,
    keys: [
      { key: "compatibility", label: "Compatibility" },
      { key: "otherFeatures", label: "Other Features" },
      { key: "includedInBox", label: "Included in the Box" },
    ],
  },
];

export default function CompareView() {
  const compare = useCompare();
  const cart = useCart();
  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  const specGroups = useMemo(() => {
    const groups = [...STATIC_GROUPS];
    const extraKeys = new Set<string>();
    const predefinedKeys = new Set(
      STATIC_GROUPS.flatMap((g) => g.keys.map((s) => s.key.toLowerCase()))
    );

    compare.items.forEach((item) => {
      if (item.specs) {
        Object.keys(item.specs).forEach((k) => {
          if (!predefinedKeys.has(k.toLowerCase())) extraKeys.add(k.toLowerCase());
        });
      }
    });

    if (extraKeys.size > 0) {
      groups.push({
        id: "additional",
        name: "Technical Info",
        icon: Cpu,
        keys: Array.from(extraKeys).map((k) => ({
          key: k,
          label: k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, " $1"),
        })),
      });
    }
    return groups;
  }, [compare.items]);

  const getDisplayValue = (item: CompareItem, key: string) => {
    if (!item) return null;
    const searchKey = key.toLowerCase();
    
    // Check top level first
    const topLevelKey = (Object.keys(item) as Array<keyof CompareItem>).find(
      (k) => k.toString().toLowerCase() === searchKey
    );
    if (topLevelKey) {
      const val = item[topLevelKey];
      return Array.isArray(val) ? (val.length > 0 ? val.join(", ") : "-") : (val as string | number | boolean);
    }

    // Check specs
    if (item.specs) {
      const specs = item.specs as Record<string, string | number | boolean>;
      const specKey = Object.keys(specs).find((k) => k.toLowerCase() === searchKey);
      if (specKey) return specs[specKey];
    }
    return "-";
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white">
        <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
          <Layers size={40} className="text-zinc-200" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 mb-2">Comparison list is empty</h2>
        <p className="text-zinc-500 mb-8 max-w-xs text-center">Add some products to compare their features side by side.</p>
        <Link href="/products" className="px-8 h-12 bg-zinc-900 text-white rounded-lg flex items-center font-bold hover:bg-zinc-800 transition-all">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f3f5] py-4 sm:py-8 lg:py-12">
      <div className="max-w-[1320px] mx-auto bg-white shadow-sm border border-[#dee2e6] rounded overflow-hidden">
        {/* Dark Top Bar */}
        <div className="bg-[#081621] px-4 py-2.5">
          <h1 className="text-white text-sm font-bold tracking-tight">
            Compare Products ({compare.items.length})
          </h1>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <tbody>
              {/* Product Header Row */}
              <tr className="border-b border-[#f1f3f5]">
                <td className="w-1/4 p-4 align-middle font-bold text-zinc-900 text-[13px] bg-[#fafafa]">
                  Product
                </td>
                {compare.items.map((item) => (
                  <td key={`header-${item.id}`} className="p-4 sm:p-8 text-center relative border-l border-[#f1f3f5] min-w-[300px]">
                    <button
                      onClick={() => compare.removeItem(item.id)}
                      className="absolute top-4 right-4 text-[#ef4444] hover:text-red-700 transition-colors"
                    >
                      <X size={20} strokeWidth={3} />
                    </button>
                    <div className="flex flex-col items-center gap-6">
                      <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                        <Image src={item.image} alt={item.name} fill className="object-contain" />
                      </div>
                      <Link href={`/products/${item.slug}`} className="text-[13px] font-bold text-zinc-900 hover:text-blue-600 transition-colors line-clamp-2 leading-relaxed">
                        {item.name}
                      </Link>
                    </div>
                  </td>
                ))}
                {compare.items.length < 4 && <td className="bg-white border-l border-[#f1f3f5]" />}
              </tr>

              {/* Action Row */}
              <tr className="border-b border-[#f1f3f5]">
                <td className="p-4 align-middle font-bold text-zinc-900 text-[13px] bg-[#fafafa]">
                  Action
                </td>
                {compare.items.map((item) => (
                  <td key={`action-${item.id}`} className="p-4 text-center border-l border-[#f1f3f5]">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="inline-flex items-center gap-2 px-6 h-9 bg-[#081621] text-white text-[12px] font-bold rounded uppercase hover:bg-zinc-800 transition-all"
                    >
                      <ShoppingCart size={14} />
                      Add to Cart
                    </button>
                  </td>
                ))}
                {compare.items.length < 4 && <td className="bg-white border-l border-[#f1f3f5]" />}
              </tr>

              {/* Availability Row */}
              <tr className="border-b border-[#f1f3f5]">
                <td className="p-4 align-middle font-bold text-zinc-900 text-[13px] bg-[#fafafa]">
                  Availability
                </td>
                {compare.items.map((item) => (
                  <td key={`avail-${item.id}`} className="p-4 text-center border-l border-[#f1f3f5]">
                    <span className="inline-block px-3 py-1 bg-[#ebfbf3] text-[#006633] text-[11px] font-bold rounded-full">
                      In Stock
                    </span>
                  </td>
                ))}
                {compare.items.length < 4 && <td className="bg-white border-l border-[#f1f3f5]" />}
              </tr>

              {/* Price Row */}
              <tr className="border-b border-[#f1f3f5]">
                <td className="p-4 align-middle font-bold text-zinc-900 text-[13px] bg-[#fafafa]">
                  Price
                </td>
                {compare.items.map((item) => (
                  <td key={`price-${item.id}`} className="p-4 text-center border-l border-[#f1f3f5]">
                    <span className="text-[#ef4444] font-bold text-[14px]">
                      ৳{item.price.toLocaleString()}
                    </span>
                  </td>
                ))}
                {compare.items.length < 4 && <td className="bg-white border-l border-[#f1f3f5]" />}
              </tr>

              {/* Basic Meta Info */}
              {["Brand", "Model", "PID", "Warranty"].map((label) => (
                <tr key={label} className="border-b border-[#f1f3f5]">
                  <td className="p-4 align-middle font-bold text-zinc-900 text-[13px] bg-[#fafafa]">
                    {label}
                  </td>
                  {compare.items.map((item) => (
                    <td key={`${label.toLowerCase()}-${item.id}`} className="p-4 text-center border-l border-[#f1f3f5] text-[13px] text-zinc-600">
                      {String(getDisplayValue(item, label) || "-")}
                    </td>
                  ))}
                  {compare.items.length < 4 && <td className="bg-white border-l border-[#f1f3f5]" />}
                </tr>
              ))}

              {/* Specification Groups */}
              {specGroups.map((group) => (
                <React.Fragment key={group.id}>
                  {/* Group Header Bar */}
                  <tr>
                    <td colSpan={compare.items.length + 1} className="bg-[#ebf4ff] p-0 border-b border-[#dee2e6]">
                      <button
                        onClick={() => setCollapsedGroups(prev => ({ ...prev, [group.id]: !prev[group.id] }))}
                        className="w-full flex items-center justify-between px-4 py-3 group/btn"
                      >
                        <div className="flex items-center gap-3">
                          <group.icon size={16} className="text-[#2c6ecb]" />
                          <span className="text-[13px] font-bold text-[#2c6ecb]">
                            {group.name}
                          </span>
                          <div className="h-px bg-[#c8e2ff] w-20 ml-2" />
                        </div>
                        <ChevronDown 
                          size={16} 
                          className={cn(
                            "text-[#2c6ecb] transition-transform duration-300",
                            !collapsedGroups[group.id] && "rotate-180"
                          )} 
                        />
                      </button>
                    </td>
                  </tr>

                  {/* Group Content */}
                  <AnimatePresence initial={false}>
                    {!collapsedGroups[group.id] && (
                      <>
                        {group.keys.map((spec) => (
                          <motion.tr
                            key={spec.key}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-b border-[#f1f3f5]"
                          >
                            <td className="p-4 align-middle font-bold text-zinc-900 text-[13px] bg-[#fafafa]">
                              {spec.label}
                            </td>
                            {compare.items.map((item) => (
                              <td key={`${group.id}-${spec.key}-${item.id}`} className="p-4 text-center border-l border-[#f1f3f5] text-[13px] text-zinc-600 leading-relaxed">
                                {String(getDisplayValue(item, spec.key) || "-")}
                              </td>
                            ))}
                            {compare.items.length < 4 && <td className="bg-white border-l border-[#f1f3f5]" />}
                          </motion.tr>
                        ))}
                      </>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}

              {/* Footer Actions */}
              <tr className="bg-[#fafafa]">
                <td className="p-4 align-middle font-bold text-zinc-900 text-[13px]">
                  Actions
                </td>
                {compare.items.map((item) => (
                  <td key={`footer-action-${item.id}`} className="p-8 text-center border-l border-[#f1f3f5]">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="inline-flex items-center gap-2 px-6 h-9 bg-[#081621] text-white text-[12px] font-bold rounded uppercase hover:bg-zinc-800 transition-all shadow-sm"
                    >
                      <ShoppingCart size={14} />
                      Add to Cart
                    </button>
                  </td>
                ))}
                {compare.items.length < 4 && (
                  <td className="p-8 text-center border-l border-[#f1f3f5]">
                    <Link href="/products" className="inline-flex flex-col items-center gap-2 text-zinc-300 hover:text-zinc-900 transition-colors group">
                      <div className="w-10 h-10 rounded-full border border-dashed border-zinc-200 flex items-center justify-center group-hover:border-zinc-900">
                        <Plus size={18} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest">Add Gear</span>
                    </Link>
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
