/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import toast from "react-hot-toast";
import ClassroomModal from "./ClassRoomsModal";

export default function ClassroomsPage() {
  const [classrooms, setClassrooms] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchClassrooms = async () => {
    const res = await fetch("/api/classrooms");
    const data = await res.json();
    setClassrooms(data);
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Classrooms</h1>
        <button
          onClick={() => { setSelected(null); setOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Classroom
        </button>

        <table className="w-full mt-4 border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Building</th>
              <th className="p-2 border">Capacity</th>
              <th className="p-2 border">Multimedia</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {classrooms.map((c: any) => (
              <tr key={c._id}>
                <td className="p-2 border">{c.classroomId}</td>
                <td className="p-2 border">{c.building}</td>
                <td className="p-2 border">{c.capacity}</td>
                <td className="p-2 border">{c.multimedia ? "Yes" : "No"}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    onClick={() => { setSelected(c); setOpen(true); }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm("Delete this classroom?")) return;
                      await fetch(`/api/classrooms/${c._id}`, { method: "DELETE" });
                      toast.success("Deleted");
                      fetchClassrooms();
                    }}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <ClassroomModal open={open} setOpen={setOpen} selected={selected} refresh={fetchClassrooms} />
      </div>
    </ProtectedRoute>
  );
}
