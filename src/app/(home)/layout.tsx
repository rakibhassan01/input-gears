import { Footer } from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import TopAnnouncement from "@/components/layout/top-announcement";
import { getStoreAppearance } from "@/modules/admin/actions";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings } = await getStoreAppearance();
  return (
    <>
      <TopAnnouncement data={settings} />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
