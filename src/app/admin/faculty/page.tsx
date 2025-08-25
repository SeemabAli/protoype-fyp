/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/admin/faculty/page.tsx
"use client";

import { useEffect, useState } from "react";
import { FiLogOut, FiEdit, FiTrash2 } from "react-icons/fi";
import ProtectedRoute from "@/components/ProtectedRoute";
import DeleteModal from "./DeleteModal";
import FacultyModal from "./FacultyModal";
import { logout } from "@/lib/logout";

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

  useEffect(() => {
    fetchFaculties();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 p-6 relative">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d89860] opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#493737] opacity-5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-[#493737]">
              Admin • Faculty
            </h1>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <FiLogOut size={18} />
              Logout
            </button>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-4">
            <div className="text-[#493737] font-semibold">
              Total Faculties: {faculties.length}
            </div>
            <button
              onClick={() => {
                setSelected(null);
                setOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#d89860] to-[#e0a670] text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              + Add Faculty
            </button>
          </div>

          {/* Table */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-[#493737]">
              <thead className="bg-[#493737] text-white rounded-t-xl">
                <tr>
                  <th className="px-4 py-2 rounded-tl-xl">#</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2 rounded-tr-xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {faculties.map((f, idx) => (
                  <tr
                    key={f._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">{f.name}</td>
                    <td className="px-4 py-2">{f.email}</td>
                    <td className="px-4 py-2 flex gap-3">
                      <button
                        onClick={() => {
                          setSelected(f);
                          setOpen(true);
                        }}
                        className="p-2 bg-[#d89860]/20 hover:bg-[#d89860]/30 rounded-lg transition"
                      >
                        <FiEdit className="text-[#d89860]" size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelected(f);
                          setDeleteOpen(true);
                        }}
                        className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition"
                      >
                        <FiTrash2 className="text-red-600" size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modals */}
          <FacultyModal
            open={open}
            setOpen={setOpen}
            selected={selected}
            refresh={fetchFaculties}
          />
          <DeleteModal
            open={deleteOpen}
            setOpen={setDeleteOpen}
            selected={selected}
            refresh={fetchFaculties}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
