import { auth } from "@/lib/auth"; // Server side auth
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // সার্ভার সাইডে সেশন চেক করা (Secure Way)
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // যদি ইউজার লগিন না থাকে, লগিন পেজে পাঠিয়ে দাও
  if (!session) {
    return redirect("/sign-in");
  }

  const user = session.user;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Smart Notes 📝</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Hi, {user.name}</span>
            {/* আমরা পরে এখানে লগআউট বাটন বসাবো */}
          </div>
        </div>

        {/* এখানে আমাদের নোটস থাকবে */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex items-center justify-center text-gray-400 cursor-pointer hover:border-gray-500 hover:text-gray-600 transition">
            <Link href="/dashboard/new">
              <div className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex items-center justify-center text-gray-400 cursor-pointer hover:border-gray-500 hover:text-gray-600 transition">
                + Create New Note
              </div>
            </Link>
          </div>
          {/* ডামি নোট কার্ড */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-bold text-lg mb-2">Project Ideas</h3>
            <p className="text-gray-600 text-sm line-clamp-3">
              1. AI SaaS App...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
