"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-[#493737] text-white p-4 flex justify-between items-center">
      <span className="font-bold text-lg">Automated Timetable</span>
      <div className="flex gap-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/faculty" className="hover:underline">
          Faculty
        </Link>
        <Link href="/courses" className="hover:underline">
          Courses
        </Link>
        <Link href="/classrooms" className="hover:underline">
          Classrooms
        </Link>
        <Link href="/schedule" className="hover:underline">
          Schedule
        </Link>
      </div>
    </nav>
  );
}
