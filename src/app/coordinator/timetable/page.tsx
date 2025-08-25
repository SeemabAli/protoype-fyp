/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import LogoutButton from "@/components/LogoutButton";
import GenerateModal from "./GenerateModal";
import toast from "react-hot-toast";

interface TimetableEntry {
  _id: string;
  course?: { title?: string; code?: string };
  faculty?: { name?: string };
  classroom?: { classroomId?: string; building?: string };
  day?: string;
  timeSlot?: { start?: string; end?: string };
  studentBatch?: string;
  semester?: string;
}

export default function CoordinatorTimetablePage() {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/timetable/fetch", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch timetable");
      setTimetable(data.timetable || []);
    } catch (err: any) {
      console.error("Fetch timetable error:", err);
      toast.error(err.message || "Error fetching timetable");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["coordinator"]}>
      {/* Header */}
      <div className="bg-[#493737] text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/VU_Logo.png/960px-VU_Logo.png"
              alt="logo"
              className="w-7 h-auto"
            />
          </div>
          <span className="text-lg font-semibold">Coordinator • Timetable</span>
        </div>

        <button className="px-4 py-2 rounded text-sm">
          <LogoutButton />
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white p-6 rounded-xl mb-6 border-l-4 shadow-sm border-[#d89860]">
          <h1 className="text-2xl font-semibold text-[#493737]">Auto-generate Timetable</h1>
          <p className="text-sm text-gray-600">
            Use the generator to create an automatic timetable (will attempt to resolve faculty/classroom conflicts).
          </p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-[#493737] font-medium">Generated entries: {timetable.length}</div>
          <div className="flex gap-2">
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 rounded bg-[#d89860] text-white hover:bg-[#c08850] transition"
            >
              Generate Timetable
            </button>
            <button
              onClick={fetchTimetable}
              className="px-4 py-2 rounded border border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#d89860]" />
              <p className="mt-2 text-gray-600">Loading timetable...</p>
            </div>
          ) : timetable.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No timetable generated yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">Day</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">Time</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">Course</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">Faculty</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">Classroom</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">Batch</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">Semester</th>
                  </tr>
                </thead>
                <tbody>
                  {timetable.map((entry) => (
                    <tr key={entry._id} className="border-t hover:bg-gray-50">
                      <td className="p-4">{entry.day}</td>
                      <td className="p-4">{entry.timeSlot?.start ?? "-"} - {entry.timeSlot?.end ?? "-"}</td>
                      <td className="p-4 text-blue-600">{entry.course?.code ?? "-"} {entry.course?.title ? `- ${entry.course.title}` : ""}</td>
                      <td className="p-4">{entry.faculty?.name ?? "-"}</td>
                      <td className="p-4">{entry.classroom?.classroomId ?? "-"} {entry.classroom?.building ? `(${entry.classroom.building})` : ""}</td>
                      <td className="p-4">{entry.studentBatch ?? "-"}</td>
                      <td className="p-4">{entry.semester ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <GenerateModal open={modalOpen} setOpen={setModalOpen} onComplete={fetchTimetable} />
      </div>
    </ProtectedRoute>
  );
}
