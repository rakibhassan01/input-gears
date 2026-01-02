import { getUserProfile } from "@/modules/account/profile-actions";
import ProfileForm from "@/modules/account/views/profile-form";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Profile Settings | InputGears",
};

export default async function ProfilePage() {
  // ১. সার্ভার সাইডে ডাটা আনা
  const user = await getUserProfile();

  // ২. লগইন না থাকলে রিডাইরেক্ট
  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-sm text-gray-500">
          Manage your public profile and account details.
        </p>
      </div>

      <ProfileForm user={user} />
    </div>
  );
}
