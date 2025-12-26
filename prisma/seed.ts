// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    name: "ThunderStrike Mechanical Keyboard",
    description:
      "RGB Backlit, Red Switches, 60% Compact Design. Perfect for gaming.",
    price: 4500.0,
    category: "Keyboard",
    image:
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
    stock: 50,
  },
  {
    name: "LogiMaster MX 3",
    description: "Ergonomic wireless mouse with hyper-fast scrolling.",
    price: 8500.0,
    category: "Mouse",
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
    stock: 30,
  },
  {
    name: "Keychron K2 Pro",
    description:
      "Wireless Mechanical Keyboard for Mac and Windows. Hot-swappable.",
    price: 10500.0,
    category: "Keyboard",
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
    stock: 20,
  },
  {
    name: "Razer Viper Ultimate",
    description: "Lightweight wireless gaming mouse with charging dock.",
    price: 7200.0,
    category: "Mouse",
    image:
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80",
    stock: 45,
  },
  {
    name: "Custom Coil Cable",
    description: "Premium aviator connector cable for mechanical keyboards.",
    price: 1200.0,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=800&q=80",
    stock: 100,
  },
  {
    name: "Desk Mat (Abstract)",
    description: "900x400mm Anti-slip rubber base extended mousepad.",
    price: 850.0,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=800&q=80",
    stock: 200,
  },
];

async function main() {
  console.log("🌱 Starting seeding...");

  // আগের সব প্রোডাক্ট মুছে ফেলবে যাতে ডুপ্লিকেট না হয় (Optional)
  await prisma.product.deleteMany();

  for (const product of products) {
    const p = await prisma.product.create({
      data: product,
    });
    console.log(`Created product with id: ${p.id}`);
  }

  console.log("✅ Seeding finished.");
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
