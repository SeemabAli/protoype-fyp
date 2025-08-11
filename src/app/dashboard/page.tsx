/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/page.tsx
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardRedirect() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/auth/signin");
  const role = (session.user as any).role;
  if (role === "admin") return redirect("/dashboard/admin");
  if (role === "coordinator") return redirect("/dashboard/coordinator");
  if (role === "faculty") return redirect("/dashboard/faculty");
  if (role === "student") return redirect("/dashboard/student");
  // fallback
  return redirect("/unauthorized");
}
