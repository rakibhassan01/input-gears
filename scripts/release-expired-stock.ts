import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function releaseExpiredStock() {
  console.log("Checking for expired stock reservations...");

  const expiredReservations = await prisma.stockReservation.findMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  if (expiredReservations.length === 0) {
    console.log("No expired reservations found.");
    return;
  }

  console.log(`Found ${expiredReservations.length} expired reservations. Releasing stock...`);

  for (const reservation of expiredReservations) {
    try {
      await prisma.$transaction(async (tx) => {
        // Restore product stock
        await tx.product.update({
          where: { id: reservation.productId },
          data: { stock: { increment: reservation.quantity } },
        });

        // Delete the reservation
        await tx.stockReservation.delete({
          where: { id: reservation.id },
        });
        
        console.log(`Released ${reservation.quantity} units for product ${reservation.productId}`);
      });
    } catch (error) {
      console.error(`Failed to release reservation ${reservation.id}:`, error);
    }
  }

  console.log("Job completed.");
}

releaseExpiredStock()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
