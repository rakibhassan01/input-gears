import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // বা middleware নাম হলে middleware
  const { pathname } = request.nextUrl;

  // ✅ FIX: লোকাল এবং সিকিউর (HTTPS) দুই ধরণের কুকিই চেক করা হচ্ছে
  const sessionCookie =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  // 2. অথ রাউট চেক
  const authRoutes = ["/sign-in", "/sign-up", "/forgot-password"];
  const isAuthRoute = authRoutes.includes(pathname);

  // 3. প্রোটেক্টেড রাউট চেক
  const protectedRoutes = ["/dashboard", "/account", "/settings"];
  // startsWith ব্যবহার করলে /dashboard/abc, /account/orders এগুলোও কাভার হবে
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // --- Logic ---

  // A. লগইন থাকা অবস্থায় অথ পেজে গেলে -> ড্যাশবোর্ডে পাঠাও
  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // B. লগইন না থাকা অবস্থায় প্রোটেক্টেড পেজে গেলে -> সাইন-ইনে পাঠাও
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

// কনফিগারেশন
export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/dashboard/:path*",
    "/account/:path*",
    "/settings/:path*",
  ],
};
