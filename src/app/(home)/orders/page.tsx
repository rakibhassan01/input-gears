import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  // ১. সেশন চেক (Server Side)
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return redirect("/sign-in");

  // ২. ডাটাবেস থেকে এই ইউজারের অর্ডার আনা
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true }, // অর্ডারের ভেতরের আইটেমসহ আনবে
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border p-4 rounded-lg shadow-sm">
            <div className="flex justify-between mb-2">
              <span className="font-bold">Order #{order.id.slice(-6)}</span>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  order.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100"
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <p className="font-bold mt-2">Total: ৳{order.totalAmount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
