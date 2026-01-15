import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OrderDetailsView, { Order } from "@/modules/account/views/order-details-view";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: {
      orderNumber: id,
      userId: session.user.id, // Security: Ensure it belongs to the user
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="md:py-4">
      <OrderDetailsView order={order as unknown as Order} />
    </div>
  );
}
