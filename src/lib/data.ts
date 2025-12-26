// lib/data.ts
import { prisma } from "@/lib/prisma"; // এখন আর এরর দিবে না

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return products;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}
