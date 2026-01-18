import ProductView from "@/modules/products/views/product-view";
import React from "react";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
}) {
  const params = await searchParams;
  return <ProductView filters={params} />;
}
