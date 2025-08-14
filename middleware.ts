// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const role = req.nextauth.token?.role as string | undefined;
    const url = req.nextUrl.pathname;

    // RBAC checks
    if (url.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    if (url.startsWith("/coordinator") && role !== "coordinator") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    if (url.startsWith("/faculty") && role !== "faculty") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    if (url.startsWith("/student") && role !== "student") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (!token) return false;

        const role = token.role as string | undefined;
        const url = req.nextUrl.pathname;

        if (url.startsWith("/admin") && role === "admin") return true;
        if (url.startsWith("/coordinator") && role === "coordinator") return true;
        if (url.startsWith("/faculty") && role === "faculty") return true;
        if (url.startsWith("/student") && role === "student") return true;

        return false;
      },
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/coordinator/:path*",
    "/faculty/:path*",
    "/student/:path*",
  ],
};