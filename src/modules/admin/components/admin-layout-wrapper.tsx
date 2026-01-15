"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "./admin-sidebar";
import { Menu, Search, Bell, BadgeCheck, ChevronDown } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
  user: {
    name: string;
    image: string | null;
  };
}

export default function AdminLayoutWrapper({ children, user }: AdminLayoutWrapperProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL পাল্টলে সার্চ ইনপুট আপডেট রাখব
  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // কারেন্ট পাথের উপর ভিত্তি করে রিডাইরেক্ট logic
    let targetPath = "/admin/products";
    if (pathname.includes("/admin/orders")) targetPath = "/admin/orders";
    if (pathname.includes("/admin/customers")) targetPath = "/admin/customers";

    router.push(`${targetPath}?q=${encodeURIComponent(searchQuery)}`);
    setIsSearchOpen(false);
  };

  // Prevent scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isSidebarOpen]);

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Mobile Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden",
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* 1. Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* --- Modern Header --- */}
        <header className="h-16 sticky top-0 z-40 flex items-center justify-between px-4 md:px-6 border-b border-gray-200/80 bg-white/80 backdrop-blur-md shadow-sm transition-all">
          {/* Left: Mobile Toggle & Breadcrumb Placeholder */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button (Visible only on mobile/tablet) */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all active:scale-95"
            >
              <Menu size={20} />
            </button>
            <h2 className="hidden md:block font-bold text-gray-700 tracking-tight">
              Admin Dashboard
            </h2>
          </div>

          {/* Center: Global Search Bar */}
          <div className="flex-1 max-w-md mx-4 hidden lg:block">
            <form onSubmit={handleSearch} className="relative group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
                size={18}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders, products..."
                className="w-full bg-gray-100/50 border border-gray-200 text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 transition-all placeholder:text-gray-400"
              />
            </form>
          </div>

          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-2 md:gap-6">
            {/* Search Toggle (Mobile) */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Search size={20} />
            </button>

            {/* Notification Bell */}
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors group">
              <Bell size={20} className="group-hover:text-gray-700" />
              <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-gray-200 cursor-pointer group">
              <div className="relative shrink-0">
                <div className="h-9 w-9 rounded-full bg-indigo-50 border border-indigo-100 overflow-hidden shadow-sm group-hover:ring-2 group-hover:ring-indigo-100 transition-all">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt=""
                      width={36}
                      height={36}
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold text-sm">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-px shadow-sm ring-1 ring-gray-100">
                  <BadgeCheck size={14} className="text-blue-600 fill-blue-50" />
                </div>
              </div>
              <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Mobile Search Overlay */}
        <div className={cn(
          "lg:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 p-4 z-30 transition-all duration-300",
          isSearchOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-4 invisible"
        )}>
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-gray-100 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              autoFocus={isSearchOpen}
            />
          </form>
        </div>

        {/* Dynamic Page Content */}
        <main className="p-4 md:p-6 overflow-y-auto h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
