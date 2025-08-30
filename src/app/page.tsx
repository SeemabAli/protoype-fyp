/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Users, BookOpen, Building, CalendarClock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d89860] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#493737] opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-4xl mx-auto">
        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-[#493737] to-[#5a4444] text-white px-8 py-12">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative text-center">
              {/* Logo Container */}
              <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ring-4 ring-white/20 overflow-hidden">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/VU_Logo.png/960px-VU_Logo.png"
                  alt="VU Logo"
                  className="max-w-[75%] max-h-[75%] object-contain"
                />
              </div>

              {/* Welcome Text */}
              <h1 className="text-3xl font-bold mb-3 tracking-tight">Dashboard</h1>
              <div className="w-16 h-1 bg-[#d89860] rounded-full mx-auto mb-4"></div>
              <p className="text-white/90 text-base font-medium">
                Automated Lecture Timetable System
              </p>
              <p className="text-white/70 text-sm mt-2">
                Virtual University of Pakistan
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-8 py-10">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Select a Module
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Manage faculty, courses, classrooms, and generate schedules.
              </p>
            </div>

            {/* Dashboard Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Faculty */}
              <Link
                href="/faculty"
                className="group flex flex-col items-center justify-center bg-gradient-to-r from-[#d89860] to-[#e0a670] hover:from-[#c88850] hover:to-[#d89860] text-white px-6 py-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-out"
              >
                <Users className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
                Faculty Management
              </Link>

              {/* Courses */}
              <Link
                href="/courses"
                className="group flex flex-col items-center justify-center bg-gradient-to-r from-[#d89860] to-[#e0a670] hover:from-[#c88850] hover:to-[#d89860] text-white px-6 py-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-out"
              >
                <BookOpen className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
                Course Management
              </Link>

              {/* Classrooms */}
              <Link
                href="/classrooms"
                className="group flex flex-col items-center justify-center bg-gradient-to-r from-[#d89860] to-[#e0a670] hover:from-[#c88850] hover:to-[#d89860] text-white px-6 py-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-out"
              >
                <Building className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
                Classroom Management
              </Link>

              {/* Schedule */}
              <Link
                href="/schedule"
                className="group flex flex-col items-center justify-center bg-gradient-to-r from-[#d89860] to-[#e0a670] hover:from-[#c88850] hover:to-[#d89860] text-white px-6 py-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-out"
              >
                <CalendarClock className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
                Lecture Scheduling
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50/50 px-8 py-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              © 2025 Virtual University of Pakistan. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
