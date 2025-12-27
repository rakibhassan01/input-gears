"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Heart,
  ChevronRight,
  Zap,
  ChevronDown,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import UserNav from "./user-nav";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, isPending } = useSession();
  // const { cartCount } = useCart();
  // Scroll Detection for Glass Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-indigo-900 text-white text-[11px] font-medium tracking-widest text-center py-2.5 uppercase">
        Free Shipping on Orders Over $100 —{" "}
        <span className="text-gray-400 border-b border-gray-400 pb-0.5 cursor-pointer hover:text-white transition">
          Shop Now
        </span>
      </div>

      {/* 2. MAIN NAVBAR */}
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md border-gray-200 py-3 shadow-sm"
            : "bg-white border-transparent py-5"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-8">
          {/* LEFT: Logo & Mobile Trigger */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-800 hover:bg-gray-100 rounded-full transition"
            >
              <Menu size={24} />
            </button>

            <Link href="/" className="flex items-center gap-1 group">
              <div className="bg-black text-white p-1.5 rounded-lg transform group-hover:rotate-6 transition-transform duration-300">
                <Zap size={20} fill="currentColor" />
              </div>
              <span className="text-2xl font-black tracking-tighter  font-sans">
                Input <span className="text-indigo-600">Gears</span>
              </span>
            </Link>

            {/* Desktop Links (Left Side) */}
            {/* <div className="hidden lg:flex items-center gap-6 ml-8 text-sm font-semibold tracking-wide text-gray-600">
              <Link href="/new" className="hover:text-black transition-colors">
                New Arrivals
              </Link>
              <Link href="/men" className="hover:text-black transition-colors">
                Men
              </Link>
              <Link
                href="/women"
                className="hover:text-black transition-colors"
              >
                Women
              </Link>
              <Link
                href="/sale"
                className="text-red-600 hover:text-red-700 transition-colors"
              >
                Sale
              </Link>
            </div> */}
          </div>

          {/* MIDDLE: Modern Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg">
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full bg-gray-100 border border-transparent text-gray-900 text-sm rounded-full pl-12 pr-4 py-3 focus:bg-white focus:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-300"
              />
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-black transition-colors"
              />
            </div>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="md:hidden p-2 text-gray-800 hover:bg-gray-100 rounded-full">
              <Search size={24} />
            </button>

            <Link
              href="/wishlist"
              className="hidden sm:block p-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors relative group"
            >
              <Heart size={24} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              href="/cart"
              className="relative p-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors group"
            >
              <ShoppingBag size={24} />
              {/* {cartCount > 0 && ( */}
              <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white group-hover:scale-110 transition-transform">
                {/* {cartCount} */}2
              </span>
              {/* )} */}
            </Link>

            {/* <Link
              href={session ? "/account" : "/sign-in"}
              aria-disabled={isPending}
              className={`p-2 rounded-full transition-all duration-300 ${
                isPending
                  ? "text-gray-300 cursor-not-allowed bg-transparent" // লোডিং স্টেট
                  : session
                  ? "text-indigo-600 bg-indigo-50 hover:bg-indigo-100" // লগইন
                  : "text-gray-800 hover:bg-gray-100" // লগআউট
              }`}
            >
              <User size={24} />
            </Link> */}
            {/* Show Loader if absolutely necessary, otherwise keep clean
            {isPending ? (
              <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
            ) : session ? (
              // ✅ UserNav Component বসালাম
              <UserNav session={session} />
            ) : (
              // Login Button
              <Link
                href="/sign-in"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                <User size={24} />
              </Link>
            )} */}
            {isPending ? (
              // ✅ Recommended Loading State (Static Placeholder)
              <div className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-gray-100 opacity-60 cursor-wait">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <div className="h-4 w-20 bg-gray-100 rounded animate-pulse hidden sm:block" />
                <ChevronDown className="w-4 h-4 text-gray-300" />
              </div>
            ) : session ? (
              // ✅ Actual User Dropdown
              <UserNav session={session} />
            ) : (
              // ✅ Logged Out State
              <Link
                href={session ? "/account" : "/sign-in"}
                aria-disabled={isPending}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isPending
                    ? "text-gray-300 cursor-not-allowed bg-transparent" // লোডিং স্টেট
                    : session
                    ? "text-indigo-600 bg-indigo-50 hover:bg-indigo-100" // লগইন
                    : "text-gray-800 hover:bg-gray-100" // লগআউট
                }`}
              >
                <User size={24} />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* 3. CUSTOM MOBILE MENU DRAWER (No Libraries) */}
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-60 transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed inset-y-0 left-0 z-70 w-[85%] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-5 flex items-center justify-between border-b">
            <span className="text-xl font-black uppercase tracking-tighter">
              Menu
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* Search in Menu */}
          <div className="p-5 pb-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-gray-100 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>

          {/* Links */}
          <div className="flex-1 overflow-y-auto p-5 space-y-1">
            {[
              "New Arrivals",
              "Best Sellers",
              "Men",
              "Women",
              "Accessories",
            ].map((item) => (
              <Link
                key={item}
                href="#"
                className="flex items-center justify-between py-4 text-lg font-medium text-gray-900 border-b border-gray-50 hover:pl-2 transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
                <ChevronRight size={16} className="text-gray-400" />
              </Link>
            ))}
            <Link
              href="#"
              className="flex items-center justify-between py-4 text-lg font-bold text-red-600 border-b border-gray-50 hover:pl-2 transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sale
              <ChevronRight size={16} className="text-red-400" />
            </Link>
          </div>

          {/* Footer Actions */}
          <div className="p-5 border-t bg-gray-50">
            <Link
              href="/login"
              className="flex items-center justify-center w-full bg-black text-white font-bold py-4 rounded-xl mb-3 hover:bg-gray-800 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign In
            </Link>
            <p className="text-center text-xs text-gray-400 uppercase tracking-wider">
              InputGears © 2025
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
