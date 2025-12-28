import { Footer } from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Toaster position="bottom-center" richColors />
      <Footer />
    </>
  );
}
