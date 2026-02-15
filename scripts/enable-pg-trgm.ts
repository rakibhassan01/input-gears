import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Enabling pg_trgm extension...");
  try {
    await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS pg_trgm;`;
    console.log("✅ pg_trgm extension enabled successfully.");
  } catch (error) {
    console.error("❌ Failed to enable pg_trgm extension:", error);
    console.log("Note: This might require superuser permissions on your Postgres database.");
    process.exit(1);
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
