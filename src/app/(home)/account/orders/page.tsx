import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OrderHistoryView from "@/modules/account/views/order-history-view";
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
    // include: { items: true } // যদি আইটেম প্রিভিউ দেখাতে চান
  });
  return (
    <div className="max-w-[1000px] mx-auto py-10 px-4">
      {/* এখানে আপনি চাইলে সাইডবার যোগ করতে পারেন */}
      <OrderHistoryView orders={orders} />
    </div>
  );
}
