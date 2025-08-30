/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSchedule = async () => {
    const res = await fetch("/api/schedule");
    const json = await res.json();
    setSchedule(json.data || []);
  };

  const generateSchedule = async () => {
    setLoading(true);
    const res = await fetch("/api/schedule/generate", { method: "POST" });
    await res.json();
    setLoading(false);
    fetchSchedule();
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#493737]">Lecture Schedule</h1>
        <button
          onClick={generateSchedule}
          disabled={loading}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#d89860] to-[#e0a670] text-white font-semibold"
        >
          {loading ? "Generating..." : "Generate Schedule"}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-4 overflow-x-auto">
        {schedule.length === 0 ? (
          <p className="text-center text-gray-500">No schedule generated yet.</p>
        ) : (
          <table className="min-w-full text-sm text-[#493737]">
            <thead className="bg-[#493737] text-white">
              <tr>
                <th className="px-4 py-2">Day</th>
                <th className="px-4 py-2">Slot</th>
                <th className="px-4 py-2">Course</th>
                <th className="px-4 py-2">Faculty</th>
                <th className="px-4 py-2">Classroom</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((s, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{s.day}</td>
                  <td className="px-4 py-2">{s.slot}</td>
                  <td className="px-4 py-2">{s.course?.courseId}</td>
                  <td className="px-4 py-2">{s.faculty?.name}</td>
                  <td className="px-4 py-2">{s.classroom?.classroomId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
