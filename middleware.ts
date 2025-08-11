// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;
    const url = req.nextUrl.pathname;

    // RBAC checks
    if (url.startsWith("/dashboard/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    if (url.startsWith("/dashboard/coordinator") && role !== "coordinator") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    if (url.startsWith("/dashboard/faculty") && role !== "faculty") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    if (url.startsWith("/dashboard/student") && role !== "student") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
);

export const config = {
  matcher: [
    "/dashboard/admin/:path*",
    "/dashboard/coordinator/:path*",
    "/dashboard/faculty/:path*",
    "/dashboard/student/:path*"
  ]
};
