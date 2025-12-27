"use client";

import Image from "next/image";
import {
  Package,
  CreditCard,
  MapPin,
  Settings,
  Clock,
  LogOut,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AccountViewProps {
  session: {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
    };
  };
}

export default function AccountView({ session }: AccountViewProps) {
  const router = useRouter();
  const user = session.user;

  // ডামি ডাটা (পরে ডাটাবেস থেকে আসবে)
  const stats = [
    {
      label: "Total Orders",
      value: "12",
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Pending",
      value: "2",
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Total Spent",
      value: "$1,250",
      icon: CreditCard,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={80}
                height={80}
                className="object-cover h-full w-full"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-indigo-600 bg-indigo-50">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
          Edit Profile
        </button>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Recent Activity & Menu */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Quick Menu */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 px-1">Settings</h3>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex flex-col">
              <MenuLink icon={Package} label="My Orders" />
              <MenuLink icon={MapPin} label="Addresses" />
              <MenuLink icon={CreditCard} label="Payment Methods" />
              <MenuLink icon={Settings} label="Account Settings" />
              <button
                onClick={async () => {
                  await authClient.signOut();
                  router.push("/sign-in");
                  toast.success("Logged out");
                }}
                className="flex items-center gap-3 px-5 py-4 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut size={18} />
                Log Out
              </button>
            </div>
          </div>
        </div>

        {/* Right: Recent Orders Placeholder */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 px-1">
            Recent Orders
          </h3>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Package className="text-gray-400" size={32} />
            </div>
            <h4 className="text-gray-900 font-medium">No recent orders</h4>
            <p className="text-gray-500 text-sm mt-1">
              Start shopping to see your orders here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Component for Menu Items
function MenuLink({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <button className="flex items-center gap-3 px-5 py-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 w-full text-left">
      <Icon size={18} className="text-gray-400" />
      {label}
    </button>
  );
}
