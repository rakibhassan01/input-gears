"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Loader2,
  User,
  Save,
  Lock,
  Smartphone,
  Mail,
  ShieldCheck,
  Camera,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // ✅ Import Image
import { CldUploadWidget } from "next-cloudinary"; // ✅ Direct Import

// Imports
import { updateProfile } from "@/modules/account/profile-actions";
import {
  profileSchema,
  ProfileFormValues,
  passwordSchema,
  PasswordFormValues,
} from "@/modules/account/profile-schema";
import { authClient } from "@/lib/auth-client";

interface ProfileFormProps {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
    phone: string | null;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  return (
    <div className="space-y-8">
      <GeneralInfoForm user={user} />
      <PasswordChangeForm email={user.email} />
    </div>
  );
}

// --- SUB COMPONENT 1: General Info ---
function GeneralInfoForm({ user }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      image: user.image || "",
      phone: user.phone || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      await updateProfile(data);
      toast.success("Profile updated successfully!");
      router.refresh();
      // রিসেট করার সময় নতুন ডাটা দিয়ে রিসেট করুন যাতে বাটন ডিজেবল হয়
      form.reset(data);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            General Information
          </h3>
          <p className="text-sm text-gray-500">
            Update your photo and personal details.
          </p>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* --- Avatar Section --- */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-4 border-b border-gray-100 border-dashed">
            {/* 1. Cloudinary Widget Wrapper */}
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              onSuccess={(result: any) => {
                if (result.info && result.info.secure_url) {
                  // ✅ Image URL Set & Enable Save Button
                  form.setValue("image", result.info.secure_url, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  toast.success("Image uploaded!");
                }
              }}
              options={{
                maxFiles: 1,
                resourceType: "image",
                clientAllowedFormats: ["png", "jpeg", "jpg", "webp"],
                sources: ["local", "camera", "url"],
              }}
            >
              {({ open }) => {
                function handleOnClick(e: React.MouseEvent) {
                  e.preventDefault();
                  open();
                }

                return (
                  // Avatar Circle Container (Clickable)
                  <div
                    onClick={handleOnClick}
                    className="relative group cursor-pointer shrink-0"
                  >
                    <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 relative z-0">
                      {form.watch("image") ? (
                        <Image
                          src={form.watch("image") || ""}
                          alt="Profile"
                          fill
                          sizes="(max-width: 768px) 100vw, 200px" // ✅ Fixes 'sizes' error
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                          <User size={48} />
                        </div>
                      )}
                    </div>

                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <Camera className="text-white w-8 h-8 mb-1" />
                      <span className="text-white text-[10px] font-medium uppercase tracking-wider">
                        Change
                      </span>
                    </div>
                  </div>
                );
              }}
            </CldUploadWidget>

            {/* Text Side */}
            <div className="text-center sm:text-left space-y-2">
              <h4 className="text-base font-bold text-gray-900">
                Profile Photo
              </h4>
              <p className="text-xs text-gray-500 max-w-[200px]">
                Click on the image to update. <br />
                Square image, Max 2MB.
              </p>
            </div>
          </div>

          {/* Form Grid (No Changes) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                Full Name
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-3.5 text-gray-400"
                />
                <input
                  {...form.register("name")}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
              {form.formState.errors.name && (
                <p className="text-red-500 text-xs ml-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                Phone Number
              </label>
              <div className="relative">
                <Smartphone
                  size={16}
                  className="absolute left-3 top-3.5 text-gray-400"
                />
                <input
                  {...form.register("phone")}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  placeholder="017..."
                />
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-3.5 text-gray-400"
                />
                <input
                  type="email"
                  disabled
                  value={user.email || ""}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed select-none"
                />
                <div className="absolute right-3 top-3 text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                  <ShieldCheck size={10} /> Verified
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !form.formState.isDirty}
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-indigo-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Save size={16} />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// PasswordChangeForm ফাংশনটি আগের মতোই থাকবে...
function PasswordChangeForm({ email }: { email: string | null }) {
  // ... আপনার আগের কোড ...
  // এখানে কোনো পরিবর্তনের প্রয়োজন নেই
  const [loading, setLoading] = useState(false);
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });
  // ... rest of the code
  return <div>{/* ... */}</div>; // Placeholder
}
