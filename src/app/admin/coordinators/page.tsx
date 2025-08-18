/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import LogoutButton from "@/components/LogoutButton";
import CoordinatorModal from "./CoordinatorModal";
import DeleteModal from "./DeleteModal";

export default function CoordinatorsPage() {
  const [coordinators, setCoordinators] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const fetchCoordinators = async () => {
    const res = await fetch("/api/coordinators", { cache: "no-store" });
    const data = await res.json();
    setCoordinators(data);
  };

  useEffect(() => { fetchCoordinators(); }, []);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin • Coordinators</h1>
          <LogoutButton />
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-4">
          <div>Total: {coordinators.length}</div>
          <button
            onClick={() => { setSelected(null); setOpen(true); }}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            + Add Coordinator
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow p-4">
          {coordinators.length === 0 ? (
            <p className="text-gray-500">No coordinators found.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Department</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coordinators.map((c) => (
                  <tr key={c._id} className="border-t">
                    <td className="p-2">{c.name}</td>
                    <td className="p-2">{c.email}</td>
                    <td className="p-2">{c.department}</td>
                    <td className="p-2 flex gap-2">
                      <button onClick={() => { setSelected(c); setOpen(true); }} className="px-2 py-1 bg-yellow-500 text-white rounded">Edit</button>
                      <button onClick={() => { setSelected(c); setDeleteOpen(true); }} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modals */}
        <CoordinatorModal open={open} setOpen={setOpen} selected={selected} refresh={fetchCoordinators} />
        <DeleteModal open={deleteOpen} setOpen={setDeleteOpen} selected={selected} refresh={fetchCoordinators} />
      </div>
    </ProtectedRoute>
  );
}
