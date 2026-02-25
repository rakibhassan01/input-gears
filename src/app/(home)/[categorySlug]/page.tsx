import ProductView from "@/modules/products/views/product-view";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    select: { slug: true },
    where: { isActive: true },
  });

  return categories.map((cat) => ({
    categorySlug: cat.slug,
  }));
}

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
  const category = await prisma.category.findFirst({
    where: { 
      slug: categorySlug,
      isActive: true,
    },
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
