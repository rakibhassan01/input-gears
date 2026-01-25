import ProductView from "@/modules/products/views/product-view";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{
    categorySlug: string;
  }>;
  searchParams: Promise<{
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { categorySlug } = await params;
  const filters = await searchParams;

  // Verify category exists
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });

  if (!category) {
    notFound();
  }

  // Combine category from slug with other filters
  const combinedFilters = {
    ...filters,
    category: category.name,
  };

  return <ProductView filters={combinedFilters} />;
}
