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

  // Related products fetching based on category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: productFromDb.categoryId,
      NOT: {
        id: productFromDb.id,
      },
    },
    take: 4,
    include: {
      category: true,
    },
  });

  // ৪. Data Transformation (DB -> UI)
  const transformedProduct: Product = {
    id: productFromDb.id,
    slug: productFromDb.slug,
    name: productFromDb.name,
    description: productFromDb.description || "",
    price: productFromDb.price,
    stock: productFromDb.stock,
    images: productFromDb.image ? [productFromDb.image] : ["/placeholder.png"],
    category: productFromDb.categoryId || "General",
    colors: productFromDb.colors || [],
    switchType: productFromDb.switchType || undefined,
    brand: productFromDb.brand,
    sku: productFromDb.sku,
    dpi: productFromDb.dpi,
    weight: productFromDb.weight,
    connectionType: productFromDb.connectionType,
    pollingRate: productFromDb.pollingRate,
    sensor: productFromDb.sensor,
    warranty: productFromDb.warranty,
    availability: productFromDb.availability,
  };

  const transformedRelatedProducts: Product[] = relatedProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description || "",
    price: p.price,
    stock: p.stock,
    images: p.image ? [p.image] : ["/placeholder.png"],
    category: p.category?.name || "General",
    brand: p.brand,
  }));

  return (
    <ProductDetailsView
      product={transformedProduct}
      relatedProducts={transformedRelatedProducts}
    />
  );
}
