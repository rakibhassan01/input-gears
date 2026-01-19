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

    const wishlistItems = await prisma.wishlistItem.findMany({
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
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(wishlistItems.map((item) => item.product));
  } catch (error) {
    console.error("Wishlist GET Error:", error);
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
    const { productId, productIds } = body;

    // Handle single item add
    if (productId) {
      await prisma.wishlistItem.upsert({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId,
          },
        },
        create: {
          userId: session.user.id,
          productId,
        },
        update: {},
      });
    }

    // Handle batch sync (for guest to account migration)
    if (productIds && Array.isArray(productIds)) {
      // Use createMany for efficiency if possible, but upsert handles duplicates better
      // Since createMany might fail on duplicates without skipDuplicates (Prisma version dependent)
      // I'll stick to a loop or Promise.all for safety with current schema
      const operations = productIds.map((id) =>
        prisma.wishlistItem.upsert({
          where: {
            userId_productId: {
              userId: session.user.id,
              productId: id,
            },
          },
          create: {
            userId: session.user.id,
            productId: id,
          },
          update: {},
        }),
      );
      await Promise.all(operations);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Wishlist POST Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
