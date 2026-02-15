import { Footer } from "@/components/layout/footer";
import Navbar, { NavbarSkeleton } from "@/components/layout/navbar";
import TopAnnouncement from "@/components/layout/top-announcement";
import { getStoreAppearance } from "@/modules/admin/actions";
import { Suspense } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings } = await getStoreAppearance();

  return (
    <NuqsAdapter>
      <TopAnnouncement data={settings} />
      <Suspense fallback={<NavbarSkeleton />}>
        <Navbar />
      </Suspense>
      <div className="pb-24 lg:pb-0">
        <Suspense fallback={<div className="min-h-screen bg-gray-50/50" />}>
          {children}
        </Suspense>
        <Footer />
      </div>
    </NuqsAdapter>
  );
}
