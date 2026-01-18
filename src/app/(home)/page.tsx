import { getStoreAppearance } from "@/modules/admin/actions";
import HeroSection from "@/modules/home/components/hero";
import BrandTicker from "@/modules/home/components/brand-ticker";
import FeaturedProducts from "@/modules/home/components/featured-products";

export const revalidate = 60;
export default async function Home() {
  const { slides } = await getStoreAppearance();
  return (
    <>
      <HeroSection slides={slides} />
      <BrandTicker />
      <FeaturedProducts />
    </>
  );
}
