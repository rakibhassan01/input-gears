import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductEditForm from "@/modules/admin/views/product-edit-form";

interface EditPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: EditPageProps) {
  // await params (Next.js 15+ compatible)
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound(); // যদি প্রোডাক্ট না পাওয়া যায়, 404 পেজে পাঠাবে
  }

  // Client Form এ ডাটা পাঠানো হচ্ছে
  return <ProductEditForm product={product} />;
}
