/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/admin/faculty/page.tsx
"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import FacultyTable from "@/components/FacultyTable";
import LogoutButton from "@/components/LogoutButton";
import DeleteModal from "./DeleteModal";
import FacultyModal from "./FacultyModal";

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
      <div className="min-h-screen p-6 bg-gray-50">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin • Faculty</h1>
          <LogoutButton />
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-4">
          <div>Total: {faculties.length}</div>
          <button
            onClick={() => { setSelected(null); setOpen(true); }}
            className="px-4 py-2 rounded bg-blue-600 text-white"
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

        {/* Modals */}
        <FacultyModal open={open} setOpen={setOpen} selected={selected} refresh={fetchFaculties} />
        <DeleteModal open={deleteOpen} setOpen={setDeleteOpen} selected={selected} refresh={fetchFaculties} />
      </div>
    </ProtectedRoute>
  );
}
