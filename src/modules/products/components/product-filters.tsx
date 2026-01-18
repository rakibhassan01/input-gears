"use client";

import { useQueryState, parseAsString, parseAsFloat } from "nuqs";
import { Search, X, SlidersHorizontal, ChevronDown, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductFiltersProps {
  categories: { id: string; name: string }[];
  brands: string[];
}

export default function ProductFilters({ categories, brands }: ProductFiltersProps) {
  const [q, setQ] = useQueryState("q", parseAsString.withDefault("").withOptions({ shallow: false, throttleMs: 500 }));
  const [category, setCategory] = useQueryState("category", parseAsString.withDefault("").withOptions({ shallow: false }));
  const [brand, setBrand] = useQueryState("brand", parseAsString.withDefault("").withOptions({ shallow: false }));
  const [minPrice, setMinPrice] = useQueryState("minPrice", parseAsFloat.withOptions({ shallow: false }));
  const [maxPrice, setMaxPrice] = useQueryState("maxPrice", parseAsFloat.withOptions({ shallow: false }));
  const [sort, setSort] = useQueryState("sort", parseAsString.withDefault("newest").withOptions({ shallow: false }));

  const activeFiltersCount = [category, brand, minPrice, maxPrice, sort !== "newest" ? sort : null].filter(Boolean).length;

  const handleReset = () => {
    setQ("");
    setCategory("");
    setBrand("");
    setMinPrice(null);
    setMaxPrice(null);
    setSort("newest");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
      {/* Search Header */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search gadgets..."
          value={q ?? ""}
          onChange={(e) => setQ(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-[2rem] shadow-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none text-gray-900 font-medium placeholder:text-gray-400"
        />
        {q && (
          <button
            onClick={() => setQ("")}
            className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-rose-500 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-indigo-600" />
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Advanced Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-black text-white">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 hover:text-indigo-600 transition-colors uppercase tracking-widest group"
        >
          <RotateCcw size={12} className="group-hover:-rotate-180 transition-transform duration-500" />
          Reset
        </button>
      </div>

      {/* Sorting */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Sort By</h4>
        <div className="grid grid-cols-1 gap-2">
          {[
            { id: "newest", label: "Newest Arrivals" },
            { id: "price_asc", label: "Price: Low to High" },
            { id: "price_desc", label: "Price: High to Low" },
            { id: "popular", label: "Best Sellers" },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setSort(option.id)}
              className={cn(
                "group flex items-center justify-between w-full p-4 rounded-2xl border text-sm font-bold transition-all duration-300",
                sort === option.id
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100"
                  : "bg-white border-gray-100 text-gray-600 hover:border-indigo-100 hover:bg-indigo-50/30"
              )}
            >
              {option.label}
              <div className={cn(
                "h-2 w-2 rounded-full transition-all duration-500",
                sort === option.id ? "bg-white scale-125" : "bg-gray-200 group-hover:bg-indigo-200"
              )} />
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1 text-nowrap">Categories</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(category === cat.name ? "" : cat.name)}
              className={cn(
                "px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border",
                category === cat.name
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-md"
                  : "bg-white border-gray-100 text-gray-600 hover:border-indigo-200 hover:text-indigo-600"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Trending Brands</h4>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-3">
          {brands.map((b) => (
            <label key={b} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={brand === b}
                  onChange={() => setBrand(brand === b ? "" : b)}
                  className="peer appearance-none h-6 w-6 border-2 border-gray-100 rounded-lg checked:bg-indigo-600 checked:border-indigo-600 transition-all"
                />
                <div className="absolute inset-0 flex items-center justify-center text-white scale-0 peer-checked:scale-100 transition-transform">
                  <ChevronDown size={14} className="-rotate-90" />
                </div>
              </div>
              <span className={cn(
                "text-sm font-bold transition-colors",
                brand === b ? "text-gray-900" : "text-gray-500 group-hover:text-gray-900"
              )}>
                {b}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Price Range</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5 focus-within:translate-y-[-2px] transition-transform">
            <label className="text-[9px] font-black text-gray-400 uppercase px-1">Min ($)</label>
            <input
              type="number"
              value={minPrice ?? ""}
              onChange={(e) => setMinPrice(e.target.value ? parseFloat(e.target.value) : null)}
              className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:border-indigo-600 outline-none transition-all"
              placeholder="0"
            />
          </div>
          <div className="space-y-1.5 focus-within:translate-y-[-2px] transition-transform">
            <label className="text-[9px] font-black text-gray-400 uppercase px-1">Max ($)</label>
            <input
              type="number"
              value={maxPrice ?? ""}
              onChange={(e) => setMaxPrice(e.target.value ? parseFloat(e.target.value) : null)}
              className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:border-indigo-600 outline-none transition-all"
              placeholder="1000+"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
