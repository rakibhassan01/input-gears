import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminLayoutWrapper from "@/modules/admin/components/admin-layout-wrapper";

import { NuqsAdapter } from "nuqs/adapters/next/app";

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
    <NuqsAdapter>
      <AdminLayoutWrapper user={session.user as any}>
        {children}
      </AdminLayoutWrapper>
    </NuqsAdapter>
  );
}
