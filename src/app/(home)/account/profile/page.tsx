import { getUserProfile } from "@/modules/account/profile-actions";
import ProfileForm from "@/modules/account/views/profile-form";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Profile Settings | InputGears",
};

export default async function ProfilePage() {
  // 1. Fetch data on server side
  const user = await getUserProfile();

  // 2. Redirect if not logged in
  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="p-4 sm:p-0">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Profile Settings</h1>
        <p className="text-sm text-gray-500 font-medium">
          Manage your public profile and account details.
        </p>
      </div>

      <ProfileForm user={user} />
    </div>
  );
}
