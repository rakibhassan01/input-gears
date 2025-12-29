import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Search, Bell, ChevronDown, Menu, BadgeCheck } from "lucide-react";
import AdminSidebar from "@/modules/admin/components/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // ✅ Security Check
  if (session?.user?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* 1. Fixed Sidebar */}
      <AdminSidebar />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* --- Modern Header --- */}
        <header className="h-16 sticky top-0 z-40 flex items-center justify-between px-6 border-b border-gray-200/80 bg-white/80 backdrop-blur-md shadow-sm transition-all">
          {/* Left: Mobile Toggle & Breadcrumb Placeholder */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button (Hidden on Desktop) */}
            <button className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Menu size={20} />
            </button>
            <h2 className="hidden md:block font-bold text-gray-700 tracking-tight">
              Admin Dashboard
            </h2>
          </div>

          {/* Center: Global Search Bar */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Search orders, products..."
                className="w-full bg-gray-100/50 border border-gray-200 text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 transition-all placeholder:text-gray-400"
              />
              {/* Keyboard Shortcut Hint */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 pointer-events-none">
                <kbd className="bg-white border border-gray-200 rounded px-1.5 py-0.5 text-[10px] font-bold text-gray-400">
                  ⌘ K
                </kbd>
              </div>
            </div>
          </div>

          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Notification Bell */}
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors group">
              <Bell size={20} className="group-hover:text-gray-700" />
              {/* Red Dot Badge */}
              <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            </button>

            {/* User Profile Menu Trigger */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer group">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-700 group-hover:text-indigo-600 transition-colors">
                  {session.user.name}
                </p>
                {/* <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                  Admin
                </p> */}
              </div>

              <div className="relative">
                <div className="h-9 w-9 rounded-full bg-gray-100 border border-gray-200 overflow-hidden shadow-sm group-hover:ring-2 group-hover:ring-indigo-100 transition-all">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt=""
                      width={36}
                      height={36}
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold">
                      {session.user.name.charAt(0)}
                    </div>
                  )}
                </div>
                {/* Online Indicator */}
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-px shadow-sm ring-1 ring-gray-100">
                  <BadgeCheck
                    size={14}
                    className="text-blue-600 fill-blue-50"
                  />
                </div>
              </div>

              <ChevronDown
                size={16}
                className="text-gray-400 group-hover:text-gray-600 transition-colors hidden md:block"
              />
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-6 overflow-y-auto h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
