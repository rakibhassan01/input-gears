import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductEditForm from "@/modules/admin/views/product-edit-form";
import { Product } from "@/types/product";

interface EditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditPageProps) {
  // await params (Next.js 15+ compatible)
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound(); // 404 if product not found
  }

  // Send data to client form
  // Casting Prisma JsonValue to Record type
  return <ProductEditForm product={product as unknown as Product} />;
}
