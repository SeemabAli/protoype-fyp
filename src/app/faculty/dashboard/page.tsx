"use client";

import LogoutButton from "@/components/LogoutButton";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <LogoutButton />
        </div>
        <p>Welcome, Admin! Manage your application here.</p>
      </div>
    </ProtectedRoute>
  );
}
