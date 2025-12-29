import { auth } from "@/lib/auth"; // আপনার অথ পাওথ
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import AdminSidebar from "@/modules/admin/components/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // ✅ Security Check: Only Admin Allowed
  if (session?.user?.role !== "admin") {
    redirect("/"); // বা 404 পেজে পাঠান
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 1. Fixed Sidebar */}
      <AdminSidebar />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
          <h2 className="font-bold text-gray-700">Admin Dashboard</h2>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">
              {session.user.name}
            </span>
            <div className="h-8 w-8 rounded-full bg-indigo-100 border border-indigo-200 overflow-hidden">
              {session.user.image && (
                <Image src={session.user.image} alt="" width={32} height={32} />
              )}
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
