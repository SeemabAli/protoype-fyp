/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import CourseModal from "./CourseModal";
import toast from "react-hot-toast";

export default function OfferedCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchCourses = async () => {
    const res = await fetch("/api/offered-courses");
    const data = await res.json();
    setCourses(data);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Offered Courses</h1>
        <button
          onClick={() => { setSelected(null); setOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Course
        </button>

        <table className="w-full mt-4 border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Code</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Enrollment</th>
              <th className="p-2 border">Multimedia</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c: any) => (
              <tr key={c._id}>
                <td className="p-2 border">{c.code}</td>
                <td className="p-2 border">{c.title}</td>
                <td className="p-2 border">{c.enrollment}</td>
                <td className="p-2 border">{c.multimediaRequired ? "Yes" : "No"}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    onClick={() => { setSelected(c); setOpen(true); }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm("Delete this course?")) return;
                      await fetch(`/api/offered-courses/${c._id}`, { method: "DELETE" });
                      toast.success("Deleted");
                      fetchCourses();
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

        <CourseModal open={open} setOpen={setOpen} selected={selected} refresh={fetchCourses} />
      </div>
    </ProtectedRoute>
  );
}
