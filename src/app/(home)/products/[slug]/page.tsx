import { prisma } from "@/lib/prisma";
import { Product } from "@/modules/products/types";
import ProductDetailsView from "@/modules/products/views/product-details-view";
import { notFound } from "next/navigation";

// 1. Next.js 15 এ params একটি Promise হয়
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailsPage(props: PageProps) {
  // 2. params কে await করতে হবে
  const params = await props.params;
  const { slug } = params;

  // ৩. ডাটাবেস থেকে প্রোডাক্ট খোঁজা
  const productFromDb = await prisma.product.findUnique({
    where: { slug },
  });

  if (!productFromDb) {
    notFound();
  }

  // ৪. Data Transformation (DB -> UI)
  const transformedProduct: Product = {
    id: productFromDb.id,
    slug: productFromDb.slug, // ✅ Cart এর জন্য Slug এখন এখানে আছে
    name: productFromDb.name,
    description: productFromDb.description || "",
    price: productFromDb.price,
    stock: productFromDb.stock, // ✅ Cart এর maxStock এর জন্য এখানে আছে

    // images array তৈরি (placeholder সহ)
    images: productFromDb.image ? [productFromDb.image] : ["/placeholder.png"],

    // ডিফল্ট ভ্যালু
    category: "General",
    colors: [],
    sizes: [],
  };

  return <ProductDetailsView product={transformedProduct} />;
}
