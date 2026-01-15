import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminLayoutWrapper, { AdminHeaderSkeleton } from "@/modules/admin/components/admin-layout-wrapper";
import { Suspense } from "react";

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
      <Suspense fallback={<AdminHeaderSkeleton />}>
        <AdminLayoutWrapper user={session.user as any}>
          {children}
        </AdminLayoutWrapper>
      </Suspense>
    </NuqsAdapter>
  );
}
