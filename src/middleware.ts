import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. কুকি চেক করা
  // নোট: প্রোডাকশনে (HTTPS) অনেক সময় কুকির নাম '__Secure-' প্রিফিক্স দিয়ে হতে পারে।
  // তবে Better Auth ডিফল্ট কনফিগারেশনে সাধারণ নামটাই ব্যবহার করে।
  const sessionCookie = request.cookies.get("better-auth.session_token");

  // 2. অথ রাউট চেক
  const authRoutes = ["/sign-in", "/sign-up", "/forgot-password"];
  const isAuthRoute = authRoutes.includes(pathname);

  // 3. প্রোটেক্টেড রাউট চেক
  // startsWith ব্যবহার করা ভালো, কারণ /dashboard/settings ও কাভার হবে
  const protectedRoutes = ["/dashboard", "/account", "/settings"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // --- Logic ---

  // A. লগইন থাকা অবস্থায় অথ পেজে গেলে -> ড্যাশবোর্ডে পাঠাও
  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // B. লগইন না থাকা অবস্থায় প্রোটেক্টেড পেজে গেলে -> সাইন-ইনে পাঠাও
  if (isProtectedRoute && !sessionCookie) {
    // রিডাইরেক্ট করার সময় বর্তমান URL টি 'callbackUrl' হিসেবে পাঠানো ভালো প্র্যাকটিস
    // যাতে লগইন শেষে ইউজার আবার আগের পেজেই ফেরত আসতে পারে।
    // আপাতত সিম্পল রাখছি:
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

// কনফিগারেশন
export const config = {
  matcher: [
    // 👇 এখানে '/forgot-password' অ্যাড করা হয়েছে
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/dashboard/:path*",
    "/account/:path*",
    "/settings/:path*", // settings রাউটও অ্যাড করে দিলাম
  ],
};
