"use client";

import { authClient } from "@/lib/auth-client";
import { Github, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SocialLogin() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSocialLogin = async (provider: "github" | "google") => {
    setIsLoading(true);
    toast.loading(`Redirecting to ${provider}...`);

    await authClient.signIn.social(
      {
        provider: provider,
        callbackURL: "/dashboard",
      },
      {
        onError: (ctx) => {
          toast.dismiss();
          toast.error(ctx.error.message || `Failed to login with ${provider}`);
          setIsLoading(false);
        },
        onSuccess: () => {
          toast.dismiss();
          toast.success("Login successful!");
        },
      }
    );
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        disabled={isLoading}
        onClick={() => handleSocialLogin("github")}
        className="flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-lg text-sm text-gray-700 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Github className="w-4 h-4 text-gray-900" />
        )}
        GitHub
      </button>

      <button
        type="button"
        disabled={isLoading}
        onClick={() => handleSocialLogin("google")}
        className="flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-lg text-sm text-gray-700 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          // SVG Icon
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        Google
      </button>
    </div>
  );
}
