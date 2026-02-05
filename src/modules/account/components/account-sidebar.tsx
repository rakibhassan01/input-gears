"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  Package,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface UserProps {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string | null;
}

interface AccountSidebarProps {
  user: UserProps;
}

const menuItems = [
  {
    title: "Overview",
    href: "/account",
    icon: LayoutDashboard,
  },
  {
    title: "My Orders",
    href: "/account/orders",
    icon: Package,
  },
  {
    title: "Shipping Addresses",
    href: "/account/addresses",
    icon: MapPin,
  },
  {
    title: "Profile Settings",
    href: "/account/profile",
    icon: User,
  },
];

export default function AccountSidebar({ user }: AccountSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = user?.role === "admin";

  const isOverviewPage = pathname === "/account";

  const handleSignOut = async () => {
    await authClient.signOut();
    toast.success("Logged out successfully");
    router.push("/sign-in");
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm h-full overflow-hidden flex flex-col transition-all duration-300">
      {!isOverviewPage ? (
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-200 shrink-0">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={48}
                  height={48}
                  className="object-cover h-full w-full"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center font-bold text-gray-500 bg-gray-100">
                  {user.name?.charAt(0)}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 truncate">{user.name}</h3>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-6 pt-6 pb-2 animate-in fade-in duration-300">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Dashboard Menu
          </h3>
        </div>
      )}

      {/* 2. Admin Switcher */}
      {isAdmin && (
        <div className="px-4 pt-4 pb-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all group"
          >
            <ShieldCheck
              size={18}
              className="group-hover:scale-110 transition-transform"
            />
            Admin Dashboard
          </Link>
        </div>
      )}

      {/* 3. Main Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1.5">
        {menuItems.map((item) => {
          const isActive =
            item.href === "/account"
              ? pathname === "/account"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                isActive
                  ? "bg-gray-900 text-white shadow-md shadow-gray-900/10 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon
                size={18}
                className={cn(isActive ? "text-white" : "text-gray-400")}
              />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* 4. Logout Button */}
      <div className="p-4 mt-auto border-t border-gray-100">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 bg-red-50/50 rounded-xl hover:bg-red-50 hover:text-red-700 transition-all"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
