import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AccountPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return redirect("/sign-in");

  return (
    <div className="max-w-md mx-auto p-8 text-center">
      <div className="w-20 h-20 bg-indigo-100 rounded-full mx-auto flex items-center justify-center text-2xl mb-4">
        {session.user.name?.charAt(0)}
      </div>

      <h1 className="text-2xl font-bold">{session.user.name}</h1>
      <p className="text-gray-500 mb-8">{session.user.email}</p>

      <div className="space-y-3">
        <Button asChild variant="outline" className="w-full">
          <Link href="/orders">View My Orders</Link>
        </Button>

        {/* Logout Button (Client Component দরকার, অথবা Link to API) */}
        <Button asChild variant="destructive" className="w-full">
          <Link href="/sign-in">Log Out (Use Auth Client)</Link>
          {/* নোট: প্রপার লগআউটের জন্য client component এ authClient.signOut() কল করতে হয় */}
        </Button>
      </div>
    </div>
  );
}
