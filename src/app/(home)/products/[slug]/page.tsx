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
    ...productFromDb,
    description: productFromDb.description || "",
    image: productFromDb.image,
    images: productFromDb.image ? [productFromDb.image] : ["/placeholder.png"],
    category: {
      id: productFromDb.categoryId || "",
      name: "General",
      slug: "general",
      description: null,
      image: null,
      parentId: null,
      isActive: true,
      isFeatured: false,
      seoTitle: null,
      seoDescription: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    specs: (productFromDb.specs as Record<string, string | number | boolean | null>) || {},
  };

  const transformedRelatedProducts: Product[] = relatedProducts.map((p) => ({
    ...p,
    description: p.description || "",
    image: p.image,
    images: p.image ? [p.image] : ["/placeholder.png"],
    category: p.category ? { ...p.category } : null,
    specs: (p.specs as Record<string, string | number | boolean | null>) || {},
  }));

  return (
    <ProductDetailsView
      product={transformedProduct}
      relatedProducts={transformedRelatedProducts}
    />
  );
}
