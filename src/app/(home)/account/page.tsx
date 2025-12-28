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

  // ১. ইউজারের সব অর্ডার নিয়ে আসা (Latest First)
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5, // ড্যাশবোর্ডে মাত্র লেটেস্ট ৫টা দেখাবো
  });

  // ২. স্ট্যাটাস ক্যালকুলেশন (Database Aggregation for better performance)
  const totalOrders = await prisma.order.count({
    where: { userId: session.user.id },
  });

  const pendingOrders = await prisma.order.count({
    where: {
      userId: session.user.id,
      status: "PENDING", // অথবা আপনার logic অনুযায়ী (e.g. PROCESSING সহ)
    },
  });

  // Total Spent Calculation
  const aggregations = await prisma.order.aggregate({
    where: { userId: session.user.id },
    _sum: { totalAmount: true },
  });
  const totalSpent = aggregations._sum.totalAmount || 0;

  // ৩. ডাটা প্যাক করে ভিউতে পাঠানো
  const dashboardData = {
    totalOrders,
    pendingOrders,
    totalSpent,
    recentOrders: orders,
  };

  return <AccountView session={session} dashboardData={dashboardData} />;
}
