"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  BadgeCheck,
  ChevronDown,
  CreditCard,
} from "lucide-react";
import Image from "next/image";

interface UserNavProps {
  session: {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
      role?: string | null;
    };
  };
}

export default function UserNav({ session }: UserNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully");

          // 👇 Advanced Redirect Logic
          // যেসব রাউট প্রোটেক্টেড, সেখান থেকে বের করে সাইন-ইনে পাঠাবো
          const protectedRoutes = [
            "/dashboard",
            "/account",
            "/settings",
            "/billing",
            "/admin",
          ];
          const isOnProtectedRoute = protectedRoutes.some((route) =>
            pathname.startsWith(route)
          );

          if (isOnProtectedRoute) {
            router.push("/sign-in"); // প্রোটেক্টেড হলে সাইন-ইনে যাও
          } else {
            router.refresh(); // পাবলিক পেজে থাকলে শুধু রিফ্রেশ দাও (UI আপডেট হবে)
          }
        },
      },
    });
  };

  const isAdmin = session.user.role === "admin";

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-all duration-200 ${
          isOpen
            ? "bg-indigo-50 border-indigo-200 ring-2 ring-indigo-100"
            : "bg-white border-gray-200 hover:border-indigo-200 hover:bg-gray-50"
        }`}
      >
        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 overflow-hidden relative">
          {session.user.image ? (
            // ✅ FIX: Added width and height props to satisfy Next.js Image
            <Image
              src={session.user.image}
              alt={session.user.name || "User Avatar"}
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-4 w-4 text-indigo-600" />
          )}
        </div>

        <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate hidden sm:block">
          {session.user.name}
        </span>

        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100 ring-1 ring-black/5 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          <div className="p-4 bg-gray-50/50 border-b border-gray-100">
            <div className="flex items-center gap-1.5 mb-1">
              <p className="font-semibold text-gray-900 truncate max-w-[150px]">
                {session.user.name}
              </p>

              {/* ✅ Badge Rendering */}
              {isAdmin && (
                <div className="relative group flex items-center justify-center">
                  <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500/10" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 truncate font-mono">
              {session.user.email}
            </p>
          </div>

          <div className="p-2 space-y-1">
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors group"
              >
                <LayoutDashboard className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
                Admin Dashboard
              </Link>
            )}

            <Link
              href="/account/orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors group"
            >
              <CreditCard className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
              Orders
            </Link>

            <div className="h-px bg-gray-100 my-1 mx-2" />

            <Link
              href="/account/profile" // ✅ FIX: Added leading slash
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors group"
            >
              <Settings className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
              Settings
            </Link>
            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors group"
            >
              <User className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
              Account
            </Link>
            <div className="h-px bg-gray-100 my-1 mx-2" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors group"
            >
              <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-600" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
