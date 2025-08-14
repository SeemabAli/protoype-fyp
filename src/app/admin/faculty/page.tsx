/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import FacultyTable from "@/components/FacultyTable";
import FacultyModal from "./FacultyModal";
import DeleteModal from "./DeleteModal";
import LogoutButton from "@/components/LogoutButton";

export default function AdminFacultyPage() {
  const [faculties, setFaculties] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const fetchFaculties = async () => {
    const res = await fetch("/api/faculty", { cache: "no-store" });
    const data = await res.json();
    setFaculties(data);
  };

  useEffect(() => { fetchFaculties(); }, []);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen p-6 bg-[linear-gradient(135deg,#ffffff_0%,#f5f5f5_100%)]">
        <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <LogoutButton />
        </div>
        <p>Welcome, Admin! Manage your application here.</p>
      </div>
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="bg-white p-6 rounded-xl mb-6 border-l-4 shadow-sm" style={{ borderLeftColor: "#d89860" }}>
            <h1 className="text-2xl font-semibold text-[#493737]">Administrator • Faculty Management</h1>
            <p className="text-sm text-gray-600">Create, view, update, and delete faculty records</p>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              Total: <span className="font-medium">{faculties.length}</span>
            </div>
            <button
              onClick={() => { setSelected(null); setOpen(true); }}
              className="px-4 py-2 rounded-lg shadow text-white"
              style={{ backgroundColor: "#d89860" }}
            >
              + Add Faculty
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow p-4">
            <FacultyTable
              data={faculties}
              onEdit={(f) => { setSelected(f); setOpen(true); }}
              onDelete={(f) => { setSelected(f); setDeleteOpen(true); }}
            />
          </div>
        </div>

        {/* Modals */}
        <FacultyModal open={open} setOpen={setOpen} selected={selected} refresh={fetchFaculties} />
        <DeleteModal open={deleteOpen} setOpen={setDeleteOpen} selected={selected} refresh={fetchFaculties} />
      </div>
    </ProtectedRoute>
  );
}
