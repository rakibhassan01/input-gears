import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            image: true,
            stock: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      cartItems.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        price: item.product.price,
        image: item.product.image || "",
        quantity: item.quantity,
        maxStock: item.product.stock,
      })),
    );
  } catch (error) {
    console.error("Cart GET Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId, quantity, items } = body;

    // Handle single item add/update
    if (productId) {
      const productExists = await prisma.product.findUnique({
        where: { id: productId },
        select: { id: true },
      });

      if (productExists) {
        await prisma.cartItem.upsert({
          where: {
            userId_productId: {
              userId: session.user.id,
              productId,
            },
          },
          create: {
            userId: session.user.id,
            productId,
            quantity: quantity || 1,
          },
          update: {
            quantity: quantity ? quantity : { increment: 1 },
          },
        });
      }
    }

    interface CartInputItem {
      id: string;
      quantity: number;
    }

    // Handle batch sync (for guest to account migration)
    if (items && Array.isArray(items)) {
      const itemIds = (items as CartInputItem[]).map((i) => i.id);
      const existingProducts = await prisma.product.findMany({
        where: { id: { in: itemIds } },
        select: { id: true },
      });
      const validIds = new Set(existingProducts.map((p) => p.id));

      for (const item of items as CartInputItem[]) {
        if (!validIds.has(item.id)) continue;

        await prisma.cartItem.upsert({
          where: {
            userId_productId: {
              userId: session.user.id,
              productId: item.id,
            },
          },
          create: {
            userId: session.user.id,
            productId: item.id,
            quantity: item.quantity,
          },
          update: {
            quantity: item.quantity,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart POST Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
