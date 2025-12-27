import AccountView from "@/modules/auth/views/account-view";
import { auth } from "@/lib/auth"; // আপনার auth কনফিগারেশন পাথ
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function page() {
  // ১. সার্ভার সাইডে সেশন ফেচ করা
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // ২. যদি ইউজার লগইন না থাকে, সাইন-ইনে পাঠিয়ে দিন
  if (!session) {
    redirect("/sign-in");
  }
  return <AccountView session={session} />;
}
