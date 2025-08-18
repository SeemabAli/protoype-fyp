/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import LogoutButton from "@/components/LogoutButton";
import toast from "react-hot-toast";
import CourseModal from "./CourseModal";
import DeleteModal from "./DeleteModal";

export default function OfferedCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/courses", { cache: "no-store" });
      const data = await res.json();
      if (res.ok) {
        setCourses(data);
      } else {
        toast.error(data.error || "Failed to fetch courses");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["coordinator"]}>
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Coordinator • Offered Courses</h1>
          <LogoutButton />
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-gray-600">
            Total Courses: <span className="font-semibold">{courses.length}</span>
          </div>
          <button
            onClick={() => {
              setSelected(null);
              setOpen(true);
            }}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            + Add Course
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No courses found.</p>
              <p className="text-sm mt-1">Click &quot;Add Course&quot; to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left font-medium text-gray-700 border-b">Course Code</th>
                    <th className="p-4 text-left font-medium text-gray-700 border-b">Course Title</th>
                    <th className="p-4 text-left font-medium text-gray-700 border-b">Department</th>
                    <th className="p-4 text-left font-medium text-gray-700 border-b">Credit Hours</th>
                    <th className="p-4 text-left font-medium text-gray-700 border-b">Enrollment</th>
                    <th className="p-4 text-left font-medium text-gray-700 border-b">Multimedia</th>
                    <th className="p-4 text-center font-medium text-gray-700 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course._id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium text-blue-600">{course.code}</td>
                      <td className="p-4 font-medium">{course.name}</td>
                      <td className="p-4 text-gray-600">{course.department}</td>
                      <td className="p-4 text-gray-600">{course.creditHours}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {course.enrollment || 0} students
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          course.multimediaRequired 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {course.multimediaRequired ? 'Required' : 'Not Required'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => {
                              setSelected(course);
                              setOpen(true);
                            }}
                            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setSelected(course);
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

        {/* Summary Stats */}
        {courses.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500">Total Courses</h3>
              <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500">Total Enrollment</h3>
              <p className="text-2xl font-bold text-blue-600">
                {courses.reduce((sum, course) => sum + (course.enrollment || 0), 0)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500">Multimedia Required</h3>
              <p className="text-2xl font-bold text-orange-600">
                {courses.filter(course => course.multimediaRequired).length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500">Total Credit Hours</h3>
              <p className="text-2xl font-bold text-green-600">
                {courses.reduce((sum, course) => sum + (course.creditHours || 0), 0)}
              </p>
            </div>
          </div>
        )}

        {/* Modals */}
        <CourseModal
          open={open}
          setOpen={setOpen}
          selected={selected}
          refresh={fetchCourses}
        />
        <DeleteModal
          open={deleteOpen}
          setOpen={setDeleteOpen}
          selected={selected}
          refresh={fetchCourses}
        />
      </div>
    </ProtectedRoute>
  );
}