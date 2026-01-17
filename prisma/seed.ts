// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding products...");

  // আগের সব ডাটা মুছে ফেলা (ক্রমান্বয়ে মুছে ফেলতে হবে ফরেন কি এরর এড়াতে)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        name: "Mechanical Keyboard X1",
        slug: "mechanical-keyboard-x1",
        description: "Premium mechanical keyboard with RGB backlighting.",
        price: 120.0,
        stock: 50,
        image:
          "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&auto=format&fit=crop&q=60",
        colors: ["#000000", "#FFFFFF", "#FF3366"],
        switchType: "Linear",
        brand: "GearsPro",
        sku: "GP-KBD-X1",
        weight: "1.2kg",
        connectionType: "Wired (USB-C)",
        pollingRate: "1000Hz",
        warranty: "2 Years",
        availability: "In Stock",
      },
      {
        name: "Wireless Gaming Mouse",
        slug: "wireless-gaming-mouse",
        description: "Ultra-fast response time with 25k DPI sensor.",
        price: 85.5,
        stock: 30,
        image:
          "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=60",
        colors: ["#000000", "#808080", "#FFD700"],
        brand: "SwiftMove",
        sku: "SM-MSE-W1",
        dpi: "25600 DPI",
        weight: "63g",
        connectionType: "Wireless 2.4GHz / Wired",
        pollingRate: "4000Hz (Dongle)",
        sensor: "HERO 25K",
        warranty: "1 Year",
        availability: "In Stock",
      },
      {
        name: "Noise Cancelling Headphones",
        slug: "noise-cancelling-headphones",
        description:
          "Immersive sound experience with active noise cancellation.",
        price: 250.0,
        stock: 15,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60",
        colors: ["#000000", "#000080"],
        brand: "AudioPure",
        sku: "AP-HDP-ANC",
        weight: "250g",
        connectionType: "Bluetooth 5.2 / 3.5mm",
        pollingRate: "N/A",
        warranty: "1 Year",
        availability: "Limited Stock",
      },
      {
        name: "4K Monitor 27-inch",
        slug: "4k-monitor-27-inch",
        description: "Crystal clear display tailored for designers.",
        price: 450.0,
        stock: 10,
        image:
          "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=60",
        colors: ["#000000", "#C0C0C0"],
        brand: "VisionMaster",
        sku: "VM-MON-4K27",
        weight: "5.5kg",
        connectionType: "HDMI 2.1 / DP 1.4",
        warranty: "3 Years",
        availability: "In Stock",
      },
      {
        name: "Ergonomic Desk Chair",
        slug: "ergonomic-desk-chair",
        description: "Maximum comfort for long working hours.",
        price: 320.0,
        stock: 20,
        image:
          "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&auto=format&fit=crop&q=60",
        colors: ["#000000", "#4B0082", "#A52A2A"],
        brand: "ComfortSit",
        sku: "CS-CHR-ERG",
        weight: "12kg",
        warranty: "5 Years",
        availability: "In Stock",
      },
      {
        name: "USB-C Hub Multiport",
        slug: "usb-c-hub-multiport",
        description: "Expand your connectivity with 7 ports.",
        price: 45.0,
        stock: 100,
        image:
          "https://images.unsplash.com/photo-1622359556214-415510b65637?w=800&auto=format&fit=crop&q=60",
        colors: ["#808080", "#FFFFFF"],
        brand: "ConnectIt",
        sku: "CI-HUB-7P",
        warranty: "1 Year",
        availability: "In Stock",
      },
      {
        name: "Smart Watch Series 5",
        slug: "smart-watch-series-5",
        description: "Track your fitness and notifications on the go.",
        price: 199.0,
        stock: 25,
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60",
        colors: ["#000000", "#FFC0CB", "#FFFFFF"],
        brand: "TimeTech",
        sku: "TT-SW-S5",
        warranty: "1 Year",
        availability: "In Stock",
      },
      {
        name: "Portable SSD 1TB",
        slug: "portable-ssd-1tb",
        description: "Lightning fast transfer speeds in a compact design.",
        price: 110.0,
        stock: 40,
        image:
          "https://images.unsplash.com/photo-1597872250969-95a985c5b2ce?w=800&auto=format&fit=crop&q=60",
        colors: ["#000000", "#FF4500"],
        brand: "DataSwift",
        sku: "DS-SSD-1TB",
        warranty: "3 Years",
        availability: "In Stock",
      },
      {
        name: "Webcam 1080p Pro",
        slug: "webcam-1080p-pro",
        description: "Look your best in every video call.",
        price: 70.0,
        stock: 60,
        image:
          "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=800&auto=format&fit=crop&q=60",
        colors: ["#000000"],
        brand: "EyeView",
        sku: "EV-WCM-1080P",
        warranty: "1 Year",
        availability: "In Stock",
      },
      {
        name: "Gaming Mouse Pad XL",
        slug: "gaming-mouse-pad-xl",
        description: "Smooth surface for precise control.",
        price: 25.0,
        stock: 150,
        image:
          "https://images.unsplash.com/photo-1610444569503-4f514603952f?w=800&auto=format&fit=crop&q=60",
        colors: ["#000000", "#32CD32"],
        brand: "SwiftPad",
        sku: "SP-MPD-XL",
        warranty: "6 Months",
        availability: "In Stock",
      },
    ],
  });

  console.log("✅ Seeding completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
