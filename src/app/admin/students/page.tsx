/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import LogoutButton from "@/components/LogoutButton";
import StudentModal from "./StudentModal";
import DeleteModal from "./DeleteModal";
import toast from "react-hot-toast";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/students", { cache: "no-store" });
      const data = await res.json();
      setStudents(data);
    } catch {
      toast.error("Failed to fetch students");
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Student Management</h1>
          <LogoutButton />
        </div>

        <div className="flex justify-between items-center mb-4">
          <span>Total: {students.length}</span>
          <button
            onClick={() => { setSelected(null); setOpen(true); }}
            className="px-4 py-2 rounded bg-green-600 text-white hover:shadow-lg transition"
          >
            + Add Student
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Registration No</th>
                <th className="p-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr><td colSpan={4} className="p-2 text-center">No students</td></tr>
              ) : (
                students.map((s) => (
                  <tr key={s._id} className="border-b">
                    <td className="p-2">{s.name}</td>
                    <td className="p-2">{s.email}</td>
                    <td className="p-2">{s.registrationNumber}</td>
                    <td className="p-2 text-right space-x-2">
                      <button
                        onClick={() => { setSelected(s); setOpen(true); }}
                        className="px-2 py-1 bg-blue-500 text-white rounded hover:shadow-md transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => { setSelected(s); setDeleteOpen(true); }}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:shadow-md transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <StudentModal open={open} setOpen={setOpen} selected={selected} refresh={fetchStudents} />
        <DeleteModal open={deleteOpen} setOpen={setDeleteOpen} selected={selected} refresh={fetchStudents} />
      </div>
    </ProtectedRoute>
  );
}
