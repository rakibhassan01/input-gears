import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

  // ✅ Maintenance Mode Enforcement
  // Skip check for admin, sign-in, and the maintenance page itself
  const isMaintenanceExempt = 
    pathname.startsWith("/admin") || 
    pathname.startsWith("/maintenance") || 
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next");

  if (!isMaintenanceExempt && session?.user?.role !== "admin") {
    try {
      interface SiteSettingsWithMaintenance {
        maintenanceMode: boolean;
      }

      const settings = (await prisma.siteSettings.findUnique({
        where: { id: "general" },
        select: { maintenanceMode: true } as Record<string, boolean>
      })) as unknown as SiteSettingsWithMaintenance | null;

      if (settings?.maintenanceMode) {
        return NextResponse.rewrite(new URL("/maintenance", request.url));
      }
    } catch (error) {
      console.error("Middleware Maintenance Check Error:", error);
    }
  }

  const isAuthRoute = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isProtectedRoute =
    pathname.startsWith("/account") ||
    pathname.startsWith("/admin") ||
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
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
