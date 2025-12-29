"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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
    // সাব-মেনু (Dropdown)
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
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "h-screen bg-gray-900 text-white transition-all duration-300 sticky top-0 flex flex-col border-r border-gray-800 z-50",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* 1. Logo Area */}
      <div className="h-16 flex items-center justify-center border-b border-gray-800 relative">
        {isCollapsed ? (
          <span className="font-bold text-xl text-indigo-500">IG</span>
        ) : (
          <span className="font-bold text-xl tracking-wider">
            INPUT<span className="text-indigo-500">GEARS</span>
          </span>
        )}

        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 bg-indigo-600 rounded-full p-1 text-white shadow-lg hover:bg-indigo-500 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* 2. Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2 custom-scrollbar">
        {sidebarItems.map((item, idx) => {
          const isActive = item.href ? pathname === item.href : false;
          const isSubmenuActive = item.submenu?.some(
            (sub) => pathname === sub.href
          );

          return (
            <div key={idx}>
              {item.submenu ? (
                // Dropdown Logic (Simplified for now)
                <div className={cn("mb-2", isCollapsed && "hidden")}>
                  <p className="px-4 text-xs font-semibold text-gray-500 uppercase mb-2 mt-4">
                    {item.title}
                  </p>
                  {item.submenu.map((sub, subIdx) => (
                    <Link
                      key={subIdx}
                      href={sub.href}
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
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all group relative",
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <item.icon
                    size={20}
                    className={cn(isCollapsed && "mx-auto")}
                  />
                  {!isCollapsed && <span>{item.title}</span>}

                  {/* Tooltip for Collapsed State */}
                  {isCollapsed && (
                    <div className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-700 pointer-events-none z-50">
                      {item.title}
                    </div>
                  )}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* 3. Footer / Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          className={cn(
            "flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-all",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut size={20} />
          {!isCollapsed && "Sign Out"}
        </button>
      </div>
    </aside>
  );
}
