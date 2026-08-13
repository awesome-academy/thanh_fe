import { auth } from "@/auth";
import { NextResponse } from "next/server";

const protectedUserRoutes = ["/checkout", "/bookings", "/wishlist", "/account"];
const protectedAdminRoutes = ["/admin"];
const authRoutes = ["/login", "/register"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = Boolean(req.auth);
  const role = req.auth?.user?.role;
  const isAdmin = role === "admin";

  const fullCallbackUrl = req.nextUrl.pathname + req.nextUrl.search;

  // 1. Redirect authenticated users away from /login and /register
  if (isAuthenticated && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 2. Protect Admin routes (/admin/**)
  if (protectedAdminRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", fullCallbackUrl);
      return NextResponse.redirect(loginUrl);
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // 3. Protect User routes (/checkout, /bookings, /wishlist, /account)
  if (protectedUserRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", fullCallbackUrl);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/checkout/:path*",
    "/bookings/:path*",
    "/wishlist/:path*",
    "/account/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
