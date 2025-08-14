/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/faculty/page.tsx
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function FacultyPage() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/auth/signin");
  const role = (session.user as any).role;
  if (role !== "faculty") return redirect("/unauthorized");

  return (
    <div>
      <h1 className="text-2xl font-bold">Faculty Dashboard</h1>
      <p className="mt-4">Welcome, {session.user?.email}</p>
      <div className="mt-6">Placeholders: Preferences, assigned timetable</div>
    </div>
  );
}
