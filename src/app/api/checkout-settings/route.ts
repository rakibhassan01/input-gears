import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [zones, settings] = await Promise.all([
      prisma.shippingZone.findMany({ orderBy: { name: "asc" } }),
      prisma.siteSettings.findUnique({ where: { id: "general" } }),
    ]);

    return NextResponse.json({
      zones,
      taxRate: settings?.taxRate ?? 0,
    });
  } catch (error) {
    console.error("Fetch Checkout Settings Error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}
