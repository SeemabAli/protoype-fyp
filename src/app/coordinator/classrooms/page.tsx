/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import LogoutButton from "@/components/LogoutButton";
import ClassroomModal from "./ClassroomModal";
import DeleteModal from "./DeleteModal";
import toast from "react-hot-toast";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function ClassroomsPage() {
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/classrooms", { cache: "no-store" });
      const data = await res.json();
      if (res.ok) setClassrooms(data);
      else toast.error(data.error || "Failed to fetch classrooms");
    } catch (e) {
      toast.error("Failed to fetch classrooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["coordinator"]}>
      {/* HEADER */}
      <div className="bg-[#493737] text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-semibold">
          Coordinator • Classrooms Management
        </h1>
        <button className="bg-[#d89860] hover:bg-[#c08850] px-4 py-2 rounded text-sm">
          <LogoutButton />
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Top Actions */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-gray-700">
            Total Classrooms:{" "}
            <span className="font-semibold">{classrooms.length}</span>
          </div>
          <button
            onClick={() => {
              setSelected(null);
              setOpen(true);
            }}
            className="px-4 py-2 rounded bg-[#d89860] text-white hover:bg-[#c08850] transition"
          >
            + Add Classroom
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-600">
              Loading classrooms...
            </div>
          ) : classrooms.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No classrooms found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4 text-left">Classroom ID</th>
                    <th className="p-4 text-left">Building</th>
                    <th className="p-4 text-left">Capacity</th>
                    <th className="p-4 text-left">Multimedia</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classrooms.map((c) => (
                    <tr key={c._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{c.classroomId}</td>
                      <td className="p-4">{c.building}</td>
                      <td className="p-4">{c.capacity} students</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            c.multimedia
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {c.multimedia ? "Available" : "Not Available"}
                        </span>
                      </td>
                      <td className="px-4 py-2 flex gap-3">
                        <button
                          onClick={() => {
                            setSelected(c);
                            setOpen(true);
                          }}
                          className="p-2 bg-[#d89860]/20 hover:bg-[#d89860]/30 rounded-lg transition"
                        >
                          <FiEdit className="text-[#d89860]" size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelected(c);
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
          )}
        </div>

        {/* Modals */}
        <ClassroomModal
          open={open}
          setOpen={setOpen}
          selected={selected}
          refresh={fetchClassrooms}
        />
        <DeleteModal
          open={deleteOpen}
          setOpen={setDeleteOpen}
          selected={selected}
          refresh={fetchClassrooms}
        />
      </div>
    </ProtectedRoute>
  );
}
