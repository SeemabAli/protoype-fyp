// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const role = req.nextauth.token?.role as string | undefined;
    const url = req.nextUrl.pathname;

    // RBAC checks
    if (url.startsWith("/admin/dashboard") && role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    if (url.startsWith("/coordinator/dashboard") && role !== "coordinator") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    if (url.startsWith("/faculty/dashboard") && role !== "faculty") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    if (url.startsWith("/student/dashboard") && role !== "student") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if user has a token (is authenticated)
        if (!token) return false;

        const role = token.role as string | undefined;
        const url = req.nextUrl.pathname;

        // Allow access based on role and path
        if (url.startsWith("/dashboard/admin") && role === "admin") return true;
        if (url.startsWith("/dashboard/coordinator") && role === "coordinator")
          return true;
        if (url.startsWith("/dashboard/faculty") && role === "faculty")
          return true;
        if (url.startsWith("/dashboard/student") && role === "student")
          return true;

        // For other dashboard paths, check if user has any valid role
        if (url.startsWith("/dashboard") && role) return true;

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
    "/dashboard/admin/:path*",
    "/dashboard/coordinator/:path*",
    "/dashboard/faculty/:path*",
    "/dashboard/student/:path*",
    "/dashboard/:path*", // Catch any other dashboard routes
  ],
};
