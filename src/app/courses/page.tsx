/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
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

  const stats = useMemo(() => {
    const total = courses.length;
    const totalEnrollment = courses.reduce((s, c) => s + (c.enrollment || 0), 0);
    const mmRequired = courses.filter((c) => c.multimediaRequired).length;
    return { total, totalEnrollment, mmRequired };
  }, [courses]);

  return (
    <>
      {/* HEADER (matches your design) */}
      <div className="bg-[#493737] text-white px-6 py-4 flex flex-wrap items-center justify-between shadow-md">
        <div className="flex items-center gap-3 min-w-[200px] mb-2 sm:mb-0">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/VU_Logo.png/960px-VU_Logo.png"
              alt="VU Logo"
              className="w-8 h-auto"
            />
          </div>
          <span className="text-lg font-semibold">Automated Timetable System</span>
        </div>
        <button className="bg-[#d89860] hover:bg-[#c08850] px-4 py-2 rounded text-sm">
          <LogoutButton />
        </button>
      </div>

      {/* MAIN */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Header Card */}
        <div className="bg-white p-6 rounded-xl mb-6 border-l-4 shadow-sm border-[#d89860]">
          <h1 className="text-2xl font-semibold text-[#493737]">Coordinator • Offered Courses</h1>
          <p className="text-sm text-gray-600">Manage offered courses, enrollment, and multimedia requirements</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-[#493737]">
            Total Courses: <span className="font-semibold">{courses.length}</span>
          </div>
          <button
            onClick={() => {
              setSelected(null);
              setOpen(true);
            }}
            className="px-4 py-2 rounded bg-[#d89860] text-white hover:bg-[#c08850] transition-colors"
          >
            + Add Course
          </button>
        </div>

        {/* Table/Card */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#d89860]" />
              <p className="mt-2 text-gray-600">Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No courses found.</p>
              <p className="text-sm mt-1">Click “Add Course” to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left font-medium text-gray-700 border-b">Course Code</th>
                    <th className="p-4 text-left font-medium text-gray-700 border-b">Title</th>
                    <th className="p-4 text-left font-medium text-gray-700 border-b">Batch</th>
                    <th className="p-4 text-left font-medium text-gray-700 border-b">Enrollment</th>
                    <th className="p-4 text-left font-medium text-gray-700 border-b">Multimedia</th>
                    <th className="p-4 text-center font-medium text-gray-700 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course._id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-semibold text-[#493737]">{course.code}</td>
                      <td className="p-4">{course.title}</td>
                      <td className="p-4 text-gray-600">{course.studentBatch || "-"}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-[#fff3e8] text-[#a86b33] rounded-full text-sm">
                          {course.enrollment || 0} students
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            course.multimediaRequired
                              ? "bg-orange-100 text-orange-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {course.multimediaRequired ? "Required" : "Not Required"}
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

        {/* Summary */}
        {courses.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500">Total Courses</h3>
              <p className="text-2xl font-bold text-[#493737]">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500">Total Enrollment</h3>
              <p className="text-2xl font-bold text-[#d89860]">{stats.totalEnrollment}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500">Multimedia Required</h3>
              <p className="text-2xl font-bold text-orange-600">{stats.mmRequired}</p>
            </div>
          </div>
        )}

        {/* Modals */}
        <CourseModal open={open} setOpen={setOpen} selected={selected} refresh={fetchCourses} />
        <DeleteModal open={deleteOpen} setOpen={setDeleteOpen} selected={selected} refresh={fetchCourses} />
      </div>
      </>
  );
}
