"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Tag, Heart, ArrowLeftRight, User } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useWishlist } from "@/modules/products/hooks/use-wishlist";
import { } from "react";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const wishlist = useWishlist();

  // No longer blocking render with isMounted to ensure instant appearance

  const wishlistCount = wishlist.items.length;

  const tabs = [
    {
      name: "Home",
      icon: Home,
      href: "/",
      isActive: pathname === "/",
    },
    {
      name: "Offers",
      icon: Tag,
      href: "/sale",
      isActive: pathname === "/sale",
    },
    {
      name: "Wishlist",
      icon: Heart,
      href: "/wishlist",
      isActive: pathname === "/wishlist",
      badge: wishlistCount,
    },
    {
      name: "Compare",
      icon: ArrowLeftRight,
      href: "/compare",
      isActive: pathname === "/compare",
    },
    {
      name: "You",
      icon: User,
      href: session ? "/account" : "/sign-in",
      isActive: pathname.startsWith("/account") || pathname === "/sign-in",
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-3xl border-t border-gray-100 rounded-t-[32px] shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.08)] pb-safe">
      <nav className="max-w-md mx-auto px-6 pt-3 pb-2 flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`relative flex flex-col items-center gap-1 transition-all duration-300 ${
                tab.isActive ? "scale-105" : "hover:scale-105 active:scale-95"
              }`}
            >
              <div
                className={`relative p-1.5 rounded-xl transition-all duration-300 ${
                  tab.isActive
                    ? "text-indigo-600 shadow-[inset_0_0_10px_rgba(79,70,229,0.08)]"
                    : "text-gray-400"
                }`}
              >
                <Icon size={20} strokeWidth={tab.isActive ? 2.5 : 2} />

                {/* Badge Overlay */}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-indigo-600 text-white text-[8px] font-black flex items-center justify-center rounded-full border border-white">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] font-black tracking-widest uppercase transition-colors duration-300 ${
                  tab.isActive ? "text-indigo-600" : "text-gray-400"
                }`}
              >
                {tab.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
