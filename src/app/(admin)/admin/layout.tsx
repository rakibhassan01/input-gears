import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminLayoutWrapper from "@/modules/admin/components/admin-layout-wrapper";

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
    <AdminLayoutWrapper user={session.user as any}>
      {children}
    </AdminLayoutWrapper>
  );
}
