"use client";
import { useSession, signOut } from "next-auth/react";

declare module "next-auth" {
  interface User {
    id: string;
    role: "admin" | "coordinator" | "faculty" | "student";
  }

  interface Session {
    user: {
      id: string;
      role: "admin" | "coordinator" | "faculty" | "student";
    } & {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-primary-500 text-white p-4 flex justify-between">
      <span className="font-bold">Automated Timetable</span>
      {session?.user && (
        <div className="flex items-center gap-4">
          <span>
            {session.user.email} ({session.user.role})
          </span>
          <button onClick={() => signOut()} className="px-3 py-1 rounded">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
