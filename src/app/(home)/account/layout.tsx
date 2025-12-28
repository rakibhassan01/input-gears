import { auth } from "@/lib/auth";
import AccountSidebar from "@/modules/account/components/account-sidebar";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Side: Sidebar (3 Columns) */}
        <div className="md:col-span-4 lg:col-span-3 sticky top-24">
          <AccountSidebar user={session.user} />
        </div>

        {/* Right Side: Dynamic Content (9 Columns) */}
        <div className="md:col-span-8 lg:col-span-9">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm min-h-[500px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
