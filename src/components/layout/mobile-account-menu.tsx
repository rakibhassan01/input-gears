"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Package,
  MapPin,
  Settings,
  LogOut,
  X,
  Heart,
  LayoutDashboard,
  BadgeCheck,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { User } from "@prisma/client";

export default function MobileAccountMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // Close menu when route changes
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [pathname, isOpen, onClose]); // Only depend on pathname to avoid infinite loops if onClose is unstable

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success("Logged out successfully");
    onClose();
    router.push("/sign-in");
  };

  if (!session) {
    return null;
  }

  const user = session.user as User;
  const isAdmin = user.role === "admin";

  const menuItems = [
    {
      label: "Account Overview",
      icon: LayoutDashboard,
      href: "/account",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "My Orders",
      icon: Package,
      href: "/account/orders",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Wishlist",
      icon: Heart,
      href: "/wishlist",
      color: "text-pink-600",
      bg: "bg-pink-50",
    },
    {
      label: "Addresses",
      icon: MapPin,
      href: "/account/addresses",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Profile Settings",
      icon: Settings,
      href: "/account/profile",
      color: "text-gray-600",
      bg: "bg-gray-50",
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-999 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drop-up Menu */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-1000 bg-white rounded-t-[32px] shadow-2xl transition-transform duration-500 ease-out lg:hidden ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "85vh" }}
      >
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Header with User Info */}
        <div className="px-6 py-6 border-b border-gray-100 bg-linear-to-br from-indigo-50/30 to-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              Your Account
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all active:scale-95"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Profile Summary */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="h-16 w-16 rounded-2xl border-2 border-white shadow-md overflow-hidden bg-gray-100">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={64}
                    height={64}
                    className="object-cover h-full w-full"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-2xl font-black text-indigo-600 bg-indigo-50">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
              {isAdmin && (
                <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1 rounded-full border-2 border-white shadow-sm">
                  <BadgeCheck size={12} />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-black text-lg text-gray-900 truncate">
                  {user.name}
                </h3>
                {isAdmin && (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest shrink-0">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 font-medium truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div
          className="px-4 py-4 overflow-y-auto"
          style={{ maxHeight: "50vh" }}
        >
          <div className="space-y-2">
            {menuItems.map((item) => {
              const isActive =
                item.href === "/account"
                  ? pathname === "/account"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all active:scale-[0.98] ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                      : "bg-white hover:bg-gray-50 border border-gray-100"
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-white/20 text-white"
                        : `${item.bg} ${item.color}`
                    }`}
                  >
                    <item.icon size={20} />
                  </div>
                  <span
                    className={`font-bold text-base ${
                      isActive ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Sign Out Button */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 p-4 text-sm font-black text-red-600 bg-red-50/50 rounded-2xl border border-red-100 hover:bg-red-50 transition-all active:scale-[0.98]"
            >
              <LogOut size={20} />
              SIGN OUT FROM ACCOUNT
            </button>
          </div>
        </div>

        {/* Bottom Padding for safe area */}
        <div className="h-20" />
      </div>
    </>
  );
}
