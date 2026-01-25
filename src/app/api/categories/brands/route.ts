import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          select: {
            brand: true,
          },
          distinct: ["brand"],
          where: {
            brand: { not: null },
            isActive: true,
          },
        },
      },
    });

    const categoriesWithBrands = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      brands: Array.from(
        new Set(cat.products.map((p) => p.brand).filter(Boolean)),
      ),
    }));

    return NextResponse.json(categoriesWithBrands);
  } catch (error) {
    console.error("Failed to fetch categorized brands:", error);
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 },
    );
  }
}
