import { getStoreAppearance } from "@/modules/admin/actions";
import HeroSection from "@/modules/home/components/hero";
import ProductView from "@/modules/products/views/product-view";

export const revalidate = 60;
export default async function Home() {
  const { slides } = await getStoreAppearance();
  return (
    <>
      <HeroSection slides={slides} />
      <ProductView />
    </>
  );
}
