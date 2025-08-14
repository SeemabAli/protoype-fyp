"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function CoordinatorDashboard() {
  return (
    <ProtectedRoute allowedRoles={["coordinator"]}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Coordinator Dashboard</h1>
        <p>Welcome! You can manage rooms, courses, and schedules here.</p>
      </div>
    </ProtectedRoute>
  );
}
