"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Search,
  User,
  Menu,
  X,
  Heart,
  ChevronRight,
  Zap,
  ShoppingBag,
  Keyboard,
  Mouse,
  Headphones,
  Monitor,
  Cpu,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import UserNav from "../../modules/auth/components/user-nav";
import dynamic from "next/dynamic";
import { useWishlist } from "@/modules/products/hooks/use-wishlist";
import MobileBottomNav from "./mobile-bottom-nav";
import { useRouter, useSearchParams } from "next/navigation";

// CartNav কে ডাইনামিকালি ইমপোর্ট করুন (SSR বন্ধ করে)
// ... (CartNav stays same)
const CartNav = dynamic(
  () => import("../../modules/cart/components/cart-nav"),
  {
    ssr: false,
    loading: () => (
      <button className="relative p-2 text-gray-300 bg-gray-50 rounded-full animate-pulse cursor-wait">
        <ShoppingBag size={24} />
      </button>
    ),
  }
);

const NAV_LINKS = [
  { name: "Keyboards", href: "/keyboards", icon: Keyboard },
  { name: "Mice", href: "/mice", icon: Mouse },
  { name: "Audio", href: "/audio", icon: Headphones },
  { name: "Monitors", href: "/monitors", icon: Monitor },
  { name: "Accessories", href: "/accessories", icon: Cpu },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session, isPending } = useSession();
  const wishlist = useWishlist();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  // Only show badge/active state after mounting
  const wishlistCount = isMounted ? wishlist.items.length : 0;
  const hasWishlistItems = wishlistCount > 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/products?q=${encodeURIComponent(searchQuery)}`);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full group/nav">
        {/* PRIMARY NAVBAR */}
        <nav
          className={`w-full transition-all duration-500 border-b border-gray-200/50 ${
            isScrolled
              ? "bg-white/90 backdrop-blur-xl py-3 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)]"
              : "bg-white py-4"
          }`}
        >
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex items-center justify-between gap-4 md:gap-8">
            {/* Desktop Left / Mobile Side: Menu & Logo Container */}
            <div className="flex items-center gap-4 flex-1">
              {/* Hamburger Menu (Mobile Only) */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex md:hidden p-2 text-gray-900 hover:bg-gray-100 rounded-xl transition-all active:scale-95 z-10"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>

              {/* Logo: Centered on mobile, Left-aligned on Desktop */}
              <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
                <Link
                  href="/"
                  className="flex items-center gap-2 group relative"
                >
                  <div className="bg-indigo-600 text-white p-2 rounded-xl transform group-hover:rotate-10 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-indigo-200">
                    <Zap size={20} fill="currentColor" />
                  </div>
                  <span className="text-xl sm:text-2xl font-black tracking-tight font-sans text-gray-900">
                    Input<span className="text-indigo-600">Gears</span>
                  </span>
                </Link>
              </div>
            </div>

            {/* MIDDLE: Search Bar (Desktop Only) - Perfectly Centered */}
            <div className="hidden md:flex flex-initial items-center">
              <form
                onSubmit={handleSearch}
                className="relative w-[450px] group"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search gadgets (e.g. Mechanical Keyboard)..."
                  className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-2xl pl-12 pr-4 py-2.5 focus:bg-white focus:border-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all duration-500"
                />
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors"
                />
              </form>
            </div>

            {/* RIGHT: Actions */}
            <div className="flex flex-1 items-center justify-end gap-1 sm:gap-3">
              <button
                className="md:hidden p-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
                aria-label="Search"
              >
                <Search size={22} />
              </button>

              <Link
                href="/wishlist"
                className="hidden md:flex p-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all relative group"
              >
                <Heart
                  size={22}
                  className={`transition-all duration-300 ${
                    hasWishlistItems
                      ? "fill-indigo-600 text-indigo-600 scale-110"
                      : "group-hover:scale-110"
                  }`}
                />
                {hasWishlistItems && (
                  <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in duration-300">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <CartNav />

              <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block" />

              {isPending ? (
                <div className="hidden sm:flex items-center gap-2 p-1 rounded-full border border-gray-100 bg-gray-50/50">
                  <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse border border-white shrink-0" />
                  <div className="h-3 w-16 bg-gray-200 rounded-full animate-pulse hidden lg:block mr-2" />
                </div>
              ) : session ? (
                <div className="hidden sm:block">
                  <UserNav session={session} />
                </div>
              ) : (
                <Link
                  href="/sign-in"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-gray-200 hover:shadow-indigo-100"
                >
                  <User size={18} />
                  <span className="hidden lg:block">Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* SECONDARY NAVBAR (Desktop Categories Row) */}
        <div
          className={`hidden lg:block w-full bg-white transition-all duration-300 border-b border-gray-100 ${
            isScrolled
              ? "h-0 overflow-hidden opacity-0 border-none"
              : "h-12 opacity-100"
          }`}
        >
          <div className="max-w-[1440px] mx-auto px-8 h-full flex items-center justify-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="group flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-indigo-600 uppercase tracking-widest transition-all"
              >
                <link.icon
                  size={14}
                  className="text-gray-300 group-hover:text-indigo-400 transition-colors"
                />
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* MOBILE MENU DRAWER */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-100 transition-opacity duration-500 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div
        className={`fixed inset-y-0 left-0 z-101 w-[85%] max-w-[320px] bg-white shadow-2xl transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Mobile Header */}
          <div className="p-6 flex items-center justify-between border-b border-gray-50">
            <Link
              href="/"
              className="flex items-center gap-2 group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-100 transform group-active:scale-95 transition-all">
                <Zap size={18} fill="currentColor" />
              </div>
              <span className="text-xl font-black tracking-tight text-gray-900">
                Input<span className="text-indigo-600">Gears</span>
              </span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-all"
            >
              <X size={24} className="text-gray-900" />
            </button>
          </div>

          {/* Quick Search in Mobile */}
          <div className="p-6 pb-2">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find your gear..."
                className="w-full bg-gray-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all border-none"
              />
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </form>
          </div>

          {/* Multi-category Links */}
          <div className="flex-1 overflow-y-auto p-6 space-y-2">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              Categories
            </p>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="group flex items-center gap-4 py-3.5 px-4 rounded-2xl hover:bg-indigo-50 transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="p-2 bg-gray-100 group-hover:bg-white group-hover:text-indigo-600 text-gray-600 rounded-xl transition-all">
                  <link.icon size={20} />
                </div>
                <span className="text-[17px] font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {link.name}
                </span>
                <ChevronRight
                  size={16}
                  className="ml-auto text-gray-300 group-hover:text-indigo-400 transform group-hover:translate-x-1 transition-all"
                />
              </Link>
            ))}

            <div className="pt-4 mt-4 border-t border-gray-50">
              <Link
                href="/sale"
                className="flex items-center gap-4 py-3.5 px-4 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-all font-bold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Zap size={20} fill="currentColor" />
                <span className="text-[17px]">Flash Sale</span>
              </Link>
            </div>
          </div>

          {/* Mobile Footer */}
          <div className="p-6 border-t bg-gray-50/50">
            {!session ? (
              <Link
                href="/sign-in"
                className="flex items-center justify-center w-full bg-gray-900 text-white font-bold py-4 rounded-2xl mb-4 hover:bg-indigo-600 transition-all shadow-lg shadow-gray-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Join Now / Sign In
              </Link>
            ) : (
              <Link
                href="/account"
                className="flex items-center justify-center w-full bg-indigo-50 text-indigo-600 font-bold py-4 rounded-2xl mb-4 hover:bg-indigo-100 transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Account Dashboard
              </Link>
            )}
            <div className="flex justify-center gap-4 text-[11px] text-gray-400 font-medium uppercase tracking-tighter">
              <Link href="/support">Support</Link>
              <Link href="/tracking">Order Tracking</Link>
              <Link href="/privacy">Privacy</Link>
            </div>
          </div>
        </div>
      </div>
      <MobileBottomNav />
    </>
  );
}

export function NavbarSkeleton() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200/50">
      <nav className="w-full py-4">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex items-center justify-between gap-4 md:gap-8">
          {/* Logo Skeleton */}
          <div className="flex items-center gap-4 flex-1">
            <div className="h-10 w-32 bg-gray-100 animate-pulse rounded-xl" />
          </div>

          {/* Search Skeleton */}
          <div className="hidden md:flex flex-initial items-center">
            <div className="h-10 w-[450px] bg-gray-50 animate-pulse rounded-2xl" />
          </div>

          {/* Actions Skeleton */}
          <div className="flex flex-1 items-center justify-end gap-3">
            <div className="h-10 w-10 bg-gray-100 animate-pulse rounded-xl" />
            <div className="h-10 w-10 bg-gray-100 animate-pulse rounded-xl" />
            <div className="h-10 w-px bg-gray-100 mx-1 hidden sm:block" />
            <div className="h-10 w-24 bg-gray-100 animate-pulse rounded-xl hidden sm:block" />
          </div>
        </div>
      </nav>
      {/* Secondary Nav Skeleton */}
      <div className="hidden lg:block w-full h-12 border-t border-gray-50">
        <div className="max-w-[1440px] mx-auto px-8 h-full flex items-center justify-center gap-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-3 w-20 bg-gray-100 animate-pulse rounded-full"
            />
          ))}
        </div>
      </div>
    </header>
  );
}
