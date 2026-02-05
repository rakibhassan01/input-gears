import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AccountView from "@/modules/account/views/account-view";

export default async function AccountPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  // 1. Fetch latest 5 orders
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // 2. Status calculation
  const totalOrders = await prisma.order.count({
    where: { userId: session.user.id },
  });

  const pendingOrders = await prisma.order.count({
    where: {
      userId: session.user.id,
      status: "PENDING",
    },
  });

  // Total Spent Calculation
  const aggregations = await prisma.order.aggregate({
    where: { userId: session.user.id },
    _sum: { totalAmount: true },
  });
  const totalSpent = aggregations._sum.totalAmount || 0;

  // 3. Send data to view
  const dashboardData = {
    totalOrders,
    pendingOrders,
    totalSpent,
    recentOrders: orders,
  };

  return <AccountView session={session} dashboardData={dashboardData} />;
}
