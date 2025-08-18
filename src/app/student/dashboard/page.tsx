/* eslint-disable @typescript-eslint/no-explicit-any */

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function StudentPage(){
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/auth/signin");
  const role = (session.user as any).role;
  if (role !== "student") return redirect("/unauthorized");

  return (
    <div>
      <h1 className="text-2xl font-bold">Student Dashboard</h1>
      <p className="mt-4">Welcome, {session.user?.email}</p>
      <div className="mt-6">Placeholders: View timetable</div>
    </div>
  );
}
