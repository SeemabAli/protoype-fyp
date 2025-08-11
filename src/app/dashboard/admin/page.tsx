import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-darkBrown">Admin Dashboard</h1>
      <p className="mt-2">Welcome, {session.user?.email}</p>
    </div>
  );
}
