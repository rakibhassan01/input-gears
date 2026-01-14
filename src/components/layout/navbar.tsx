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
  ChevronDown,
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

// CartNav কে ডাইনামিকালি ইমপোর্ট করুন (SSR বন্ধ করে)
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, isPending } = useSession();

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

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-xl py-3 border-b border-gray-200/50 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)]"
            : "bg-white py-5 border-b border-transparent"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex items-center justify-between gap-4 md:gap-8">
          {/* LEFT: Logo & Mobile Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2.5 -ml-2 text-gray-900 hover:bg-gray-100 rounded-xl transition-all active:scale-95"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

            <Link href="/" className="flex items-center gap-2 group relative">
              <div className="bg-indigo-600 text-white p-2 rounded-xl transform group-hover:rotate-[10deg] group-hover:scale-110 transition-all duration-500 shadow-lg shadow-indigo-200">
                <Zap size={20} fill="currentColor" />
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tight font-sans text-gray-900">
                Input<span className="text-indigo-600">Gears</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 ml-10">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-4 py-2 text-[14px] font-semibold text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-lg transition-all duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* MIDDLE: Search Bar (Desktop Only) */}
          <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg">
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Search gadgets (e.g. Mechanical Keyboard)..."
                className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-2xl pl-12 pr-4 py-2.5 focus:bg-white focus:border-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all duration-500"
              />
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors"
              />
            </div>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-1 sm:gap-3">
            <button className="md:hidden p-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-all" aria-label="Search">
              <Search size={22} />
            </button>

            <Link
              href="/wishlist"
              className="hidden sm:flex p-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all relative group"
            >
              <Heart size={22} className="group-hover:scale-110 transition-transform" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <CartNav />

            <div className="h-8 w-[1px] bg-gray-200 mx-1 hidden sm:block" />

            {isPending ? (
              <div className="flex items-center gap-2 p-1.5 rounded-full border border-gray-100 opacity-60 cursor-wait">
                <div className="h-8 w-8 rounded-full bg-gray-100 animate-pulse" />
                <div className="h-4 w-16 bg-gray-100 rounded animate-pulse hidden lg:block" />
              </div>
            ) : session ? (
              <UserNav session={session} />
            ) : (
              <Link
                href="/sign-in"
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-gray-200 hover:shadow-indigo-100"
              >
                <User size={18} />
                <span className="hidden lg:block">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE MENU DRAWER */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-500 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div
        className={`fixed inset-y-0 left-0 z-[101] w-[85%] max-w-[320px] bg-white shadow-2xl transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Mobile Header */}
          <div className="p-6 flex items-center justify-between border-b border-gray-50">
            <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-sm">
                <Zap size={18} fill="currentColor" />
              </div>
              <span className="text-xl font-black tracking-tight">InputGears</span>
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
            <div className="relative">
              <input
                type="text"
                placeholder="Find your gear..."
                className="w-full bg-gray-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all border-none"
              />
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>

          {/* Multi-category Links */}
          <div className="flex-1 overflow-y-auto p-6 space-y-2">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Categories</p>
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
                <ChevronRight size={16} className="ml-auto text-gray-300 group-hover:text-indigo-400 transform group-hover:translate-x-1 transition-all" />
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
    </>
  );
}
