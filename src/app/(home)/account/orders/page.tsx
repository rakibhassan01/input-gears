import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OrderHistoryView, { Order } from "@/modules/account/views/order-history-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function OrderHistoryPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  // ইউজারের সব অর্ডার নিয়ে আসা
  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: { items: true }
      },
      items: {
        take: 3 // Preview first 3 items
      }
    }
  });

  return (
    <div className="md:py-4">
      <OrderHistoryView orders={orders as unknown as Order[]} />
    </div>
  );
}
