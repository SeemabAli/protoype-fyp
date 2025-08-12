"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      switch (session.user.role) {
        case "admin":
          router.push("/admin/dashboard");
          break;
        case "coordinator":
          router.push("/coordinator/dashboard");
          break;
        case "faculty":
          router.push("/teacher/dashboard");
          break;
        case "student":
          router.push("/student/dashboard");
          break;
      }
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-4 text-blue-600">
        Automated Lecture Timetable System
      </h1>
      <p className="text-gray-700 mb-6">
        Please log in to access your dashboard.
      </p>
      <Link
        href="/auth/signin"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition"
      >
        Login
      </Link>
    </div>
  );
}
