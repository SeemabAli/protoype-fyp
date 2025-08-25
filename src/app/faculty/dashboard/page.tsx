/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import ProtectedRoute from "@/components/ProtectedRoute";
import LogoutButton from "@/components/LogoutButton";

export default function FacultyDashboard() {
  const { data: session } = useSession();

  return (
    <ProtectedRoute allowedRoles={["faculty"]}>
      {/* HEADER */}
      <div className="bg-[#493737] text-white px-6 py-4 flex flex-wrap items-center justify-between shadow-md">
        <div className="flex items-center gap-3 min-w-[200px] mb-2 sm:mb-0">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/VU_Logo.png/960px-VU_Logo.png"
              alt="VU Logo"
              className="w-8 h-auto"
            />
          </div>
          <span className="text-lg font-semibold">
            Automated Timetable System
          </span>
        </div>
        <button className="px-4 py-2 rounded text-sm">
          <LogoutButton />
        </button>
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Dashboard Header */}
        <div className="bg-white p-6 rounded-xl mb-6 border-l-4 shadow-sm border-[#d89860]">
          <h1 className="text-2xl font-semibold text-[#493737]">
            Faculty Dashboard
          </h1>
          <p className="text-sm text-gray-600">
            Enter course preferences and view your timetable when available.
          </p>
          {session?.user?.name && (
            <p className="text-sm text-gray-500 mt-1">
              Logged in as{" "}
              <span className="font-medium">{session.user.name}</span> (
              {session.user.email})
            </p>
          )}
        </div>

        {/* BUTTON GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 - Course Preferences */}
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:-translate-y-1 transition-transform">
            <Link href="/faculty/faculty-preferences">
              <button className="w-full py-2 bg-[#d89860] text-white rounded-lg hover:bg-[#c08850]">
                Enter Course Preferences
              </button>
            </Link>
          </div>

          {/* Card 2 - View Timetable */}
          {/* <div className="bg-white rounded-xl shadow-md p-6 text-center hover:-translate-y-1 transition-transform">
            <Link href="/faculty/timetable">
              <button className="w-full py-2 bg-[#d89860] text-white rounded-lg hover:bg-[#c08850]">
                View My Timetable
              </button>
            </Link>
          </div> */}
        </div>
      </div>
    </ProtectedRoute>
  );
}
