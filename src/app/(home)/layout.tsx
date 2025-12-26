import { Footer } from "@/modules/home/components/footer";
import Navbar from "@/modules/home/components/navbar";
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
