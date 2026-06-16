import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

const publicPaths = [
  "/login",
  "/register",
  "/doctors",
  "/api/auth/login",
  "/api/auth/register",
  "/api/doctors",
];

const adminPaths = ["/dashboard/admin", "/api/admin"];

const doctorPaths = ["/dashboard/doctor"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  const payload = token ? verifyToken(token) : null;

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/api/")) {
    if (!payload) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (adminPaths.some((p) => pathname.startsWith(p)) && payload.role !== "ADMIN") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (
      pathname === "/dashboard/doctor" &&
      payload.role !== "DOCTOR" &&
      payload.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  const requestHeaders = new Headers(request.headers);
  if (payload) {
    requestHeaders.set("x-user-id", payload.userId);
    requestHeaders.set("x-user-role", payload.role);
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
