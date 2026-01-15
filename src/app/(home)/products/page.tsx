import ProductView from "@/modules/products/views/product-view";
import React from "react";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return <ProductView searchQuery={q} />;
}
