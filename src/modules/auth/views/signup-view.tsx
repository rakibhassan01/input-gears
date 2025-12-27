"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Mail, Lock, Eye, EyeOff, Loader2, User, Settings } from "lucide-react";
import SocialLogin from "../components/social-login";

// --- Validation Schema ---
const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  // Regex used to avoid deprecation warning
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type SignUpData = z.infer<typeof signUpSchema>;

export default function SignUpView() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignUpData) => {
    setIsLoading(true);

    try {
      // 👇 Better Auth SignUp Method
      await authClient.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: data.name, // Extra field for Sign Up
          callbackURL: "/dashboard",
        },
        {
          onError: (ctx) => {
            toast.error(ctx.error.message || "Something went wrong");
            setIsLoading(false);
          },
          onSuccess: () => {
            toast.success("Account created successfully!");
            router.push("/dashboard");
            router.refresh();
          },
        }
      );
    } catch (error) {
      toast.error("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white px-4 relative overflow-hidden">
      {/* Background Decor (Same as SignIn) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* --- Main Card --- */}
      {/* Note: Added -mt-20 to match the "lifted" look */}
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 relative z-10 animate-in fade-in zoom-in duration-500 -mt-20">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2 group">
            <div className="p-2 bg-gray-50 rounded-lg border border-gray-200 group-hover:border-indigo-500/30 transition-colors">
              <Settings className="w-6 h-6 text-indigo-600 animate-[spin_10s_linear_infinite]" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-gray-500">
            Join Input Gears to start building
          </p>
        </div>

        {/* --- Form --- */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name Field (New) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 ml-1">
              Full Name
            </label>
            <div className="relative group">
              <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                {...register("name")}
                type="text"
                placeholder="John Doe"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500 ml-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 ml-1">
              Email
            </label>
            <div className="relative group">
              <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                {...register("email")}
                type="email"
                placeholder="name@example.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 ml-1">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Min 8 characters"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-xs text-gray-500 font-medium">
            OR CONTINUE WITH
          </span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        {/* Social Login (Reused) */}
        <SocialLogin />

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-500">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-indigo-600 hover:text-indigo-500 font-semibold transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
