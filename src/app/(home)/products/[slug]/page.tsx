import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
// এখানে আপনার আগের 'ProductCard' এর AddToCart লজিকটা বসাতে পারেন বা সিম্পল রাখতে পারেন

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  // ১. স্লাগ দিয়ে প্রোডাক্ট খোঁজা
  const product = await prisma.product.findUnique({
    where: { slug: params.slug }, // id এর বদলে slug
  });

  if (!product) return <div>Product not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 grid md:grid-cols-2 gap-8">
      {/* Image */}
      <div className="relative h-96 bg-gray-100 rounded-xl overflow-hidden">
        <Image
          src={product.image || "/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-xl text-indigo-600 font-bold">৳{product.price}</p>
        <p className="text-gray-600">{product.description}</p>

        <div className="pt-4">
          {/* এখানে Add to Cart বাটন হবে (ক্লায়েন্ট কম্পোনেন্ট ব্যবহার করে) */}
          <Button className="w-full">Add to Cart</Button>
          <Link
            href="/"
            className="block text-center mt-4 text-sm text-gray-500 underline"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
