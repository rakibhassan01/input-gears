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
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Side: Sidebar (Hidden on mobile) */}
          <div className="hidden md:block w-72 shrink-0">
            <div className="sticky top-24">
              <AccountSidebar user={session.user} />
            </div>
          </div>

          {/* Right Side: Dynamic Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white md:border border-gray-100 md:rounded-[32px] md:shadow-sm">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
