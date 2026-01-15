"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // ✅ useRouter যোগ করা হয়েছে
import { cn } from "@/lib/utils";
import { toast } from "sonner"; // ✅ toast যোগ করা হয়েছে
import { authClient } from "@/lib/auth-client"; // ⚠️ আপনার authClient এর পাথ চেক করুন
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  PackagePlus,
  List,
  LogOut,
  Layers,
  Loader2,
  Paintbrush,
  Zap,
  X,
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    icon: ShoppingBag,
    submenu: [
      { title: "All Products", href: "/admin/products", icon: List },
      { title: "Add New", href: "/admin/products/create", icon: PackagePlus },
      { title: "Categories", href: "/admin/categories", icon: Layers },
    ],
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Store Appearance",
    icon: Paintbrush, // lucide-react থেকে import করবেন
    href: "/admin/appearance",
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
      toast.success("Logged out successfully");
      router.replace("/sign-in");
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Failed to log out");
      setIsLoggingOut(false);
    }
  };

  return (
    <aside
      className={cn(
        "h-screen bg-gray-900 text-white transition-all duration-300 flex flex-col border-r border-gray-800 z-50",
        isCollapsed ? "w-20" : "w-72",
        "fixed lg:sticky top-0 left-0",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      {/* 1. Logo Area */}
      <div className="h-16 flex items-center justify-center border-b border-gray-800 relative shrink-0">
        {isCollapsed ? (
          <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-lg shadow-indigo-900/40">
            <Zap size={20} fill="currentColor" />
          </div>
        ) : (
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg transform group-hover:rotate-10 transition-all duration-300">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              INPUT<span className="text-indigo-500 font-black">GEARS</span>
            </span>
          </Link>
        )}

        {/* Collapse Button (Hidden on Mobile) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 bg-indigo-600 rounded-full p-1 text-white shadow-lg hover:bg-indigo-500 transition-colors z-50 hidden lg:block"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Close Button (Mobile Only) */}
        <button
          onClick={onClose}
          className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* 2. Navigation Items */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 space-y-2 scrollbar-hide">
        {sidebarItems.map((item, idx) => {
          const isActive = item.href ? pathname === item.href : false;

          return (
            <div key={idx}>
              {item.submenu ? (
                // Dropdown Logic
                <div className={cn("mb-2", isCollapsed && "hidden")}>
                  <p className="px-4 text-xs font-semibold text-gray-500 uppercase mb-2 mt-4">
                    {item.title}
                  </p>
                  {item.submenu.map((sub, subIdx) => (
                    <Link
                      key={subIdx}
                      href={sub.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition-all mb-1",
                        pathname === sub.href
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      )}
                    >
                      <sub.icon size={18} />
                      {sub.title}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  href={item.href!}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all group relative",
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <item.icon size={20} className="shrink-0" />

                  {!isCollapsed && <span>{item.title}</span>}

                  {/* Tooltip for Collapsed State */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-6 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-700 pointer-events-none z-100 shadow-xl">
                      {item.title}
                      <div className="absolute top-1/2 -left-1 -mt-1 border-4 border-transparent border-r-gray-700" />
                    </div>
                  )}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* 3. Footer / Logout */}
      <div className="p-4 border-t border-gray-800 shrink-0">
        <button
          onClick={handleSignOut}
          disabled={isLoggingOut}
          className={cn(
            "flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed",
            isCollapsed && "justify-center px-2"
          )}
        >
          {isLoggingOut ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <LogOut size={20} />
          )}

          {!isCollapsed && (isLoggingOut ? "Signing out..." : "Sign Out")}
        </button>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </aside>
  );
}
