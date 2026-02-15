import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Inspecting Prisma Client properties...");
  const keys = Object.keys(prisma);
  console.log("Prisma properties:", keys.filter(k => !k.startsWith("_")));
  
  if ("siteSettings" in prisma) {
    console.log("✅ SiteSettings found in prisma client.");
  } else {
    console.log("❌ SiteSettings NOT found in prisma client.");
    // Try to find anything similar
    const closeMatches = keys.filter(k => k.toLowerCase().includes("settings"));
    console.log("Similar properties:", closeMatches);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
