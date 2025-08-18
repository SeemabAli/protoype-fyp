/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import LogoutButton from "@/components/LogoutButton";
import toast from "react-hot-toast";
import ClassroomModal from "./ClassroomModal";
import DeleteModal from "./DeleteModal";

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
      if (res.ok) {
        setClassrooms(data);
      } else {
        toast.error(data.error || "Failed to fetch classrooms");
      }
    } catch (error) {
      console.error("Error fetching classrooms:", error);
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
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Coordinator • Classrooms Management</h1>
          <LogoutButton />
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-gray-600">
            Total Classrooms: <span className="font-semibold">{classrooms.length}</span>
          </div>
          <button
            onClick={() => {
              setSelected(null);
              setOpen(true);
            }}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            + Add Classroom
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading classrooms...</p>
            </div>
          ) : classrooms.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No classrooms found.</p>
              <p className="text-sm mt-1">Click &quot;Add Classroom&quot; to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left font-medium text-gray-700 border-b">Classroom ID</th>
                    <th className="p-4 text-left font-medium text-gray-700 border-b">Building</th>
                    <th className="p-4 text-left font-medium text-gray-700 border-b">Capacity</th>
                    <th className="p-4 text-left font-medium text-gray-700 border-b">Multimedia</th>
                    <th className="p-4 text-center font-medium text-gray-700 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classrooms.map((classroom) => (
                    <tr key={classroom._id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{classroom.name}</td>
                      <td className="p-4 text-gray-600">{classroom.location}</td>
                      <td className="p-4 text-gray-600">{classroom.capacity} students</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          classroom.hasMultimedia 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {classroom.hasMultimedia ? 'Available' : 'Not Available'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => {
                              setSelected(classroom);
                              setOpen(true);
                            }}
                            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setSelected(classroom);
                              setDeleteOpen(true);
                            }}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                          >
                            Delete
                          </button>
                        </div>
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