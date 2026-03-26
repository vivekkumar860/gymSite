import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES } from "@/config/routes";

const AUTH_COOKIE_NAME = "auth_token";

const PUBLIC_PATHS: Set<string> = new Set([
  ROUTES.auth.login,
  ROUTES.auth.register,
]);

const ADMIN_PATH_PREFIX = "/admin";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAuthCookie = request.cookies.has(AUTH_COOKIE_NAME);

  const isPublicPath = PUBLIC_PATHS.has(pathname);
  const isAdminPath = pathname.startsWith(ADMIN_PATH_PREFIX);

  // Redirect authenticated users away from login/register
  if (isPublicPath && hasAuthCookie) {
    return NextResponse.redirect(new URL(ROUTES.dashboard, request.url));
  }

  // Redirect unauthenticated users to login
  if (!isPublicPath && !hasAuthCookie && pathname !== "/") {
    const loginUrl = new URL(ROUTES.auth.login, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin paths require auth cookie (role check happens in layout server component)
  if (isAdminPath && !hasAuthCookie) {
    return NextResponse.redirect(new URL(ROUTES.auth.login, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
