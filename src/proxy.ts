import { auth } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js 16 Proxy (formerly Middleware)
 * Handles route protection and smart authentication redirects.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // session check using Better Auth API
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const isAuthRoute = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isProtectedRoute =
    pathname.startsWith("/account") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/dashboard");

  // If user is logged in & trying to access auth routes -> redirect to account
  if (session?.user && isAuthRoute) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  // If user is NOT logged in & trying to access protected routes -> redirect to sign-in with callbackURL
  if (!session?.user && isProtectedRoute) {
    const callbackURL = encodeURIComponent(pathname);
    return NextResponse.redirect(
      new URL(`/sign-in?callbackURL=${callbackURL}`, request.url)
    );
  }

  // ✅ Admin Role Enforcement
  if (pathname.startsWith("/admin") && session?.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    "/admin/:path*",
    "/checkout/:path*",
    "/dashboard/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
