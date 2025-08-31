/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const slots = [
    "08:00am – 09:30am",
    "09:30am – 11:00am",
    "11:00am – 12:30pm",
    "01:30pm – 03:00pm",
    "03:00pm – 04:30pm",
  ];

  const fetchSchedule = async () => {
    const res = await fetch("/api/schedule");
    const json = await res.json();
    setSchedule(json.data || []);
  };

  const generateSchedule = async () => {
    setLoading(true);
    await fetch("/api/schedule/generate", { method: "POST" });
    setLoading(false);
    fetchSchedule();
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  // Group schedule by [day][slot]
  const grid: Record<string, Record<string, any[]>> = {};
  for (const d of days) {
    grid[d] = {};
    for (const s of slots) {
      grid[d][s] = [];
    }
  }
  for (const entry of schedule) {
    grid[entry.day]?.[entry.slot]?.push(entry);
  }

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

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-center border border-[#493737]">
          <thead className="bg-[#493737] text-white">
            <tr>
              <th className="px-4 py-2">Weekday</th>
              {slots.map((s, idx) => (
                <th key={idx} className="px-4 py-2">{s}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day, dIdx) => (
              <tr key={dIdx} className="border-t">
                <td className="px-4 py-2 font-semibold">{day}</td>
                {slots.map((slot, sIdx) => (
                  <td
                    key={sIdx}
                    className="px-2 py-2 border-l align-top"
                  >
                    {grid[day][slot].length === 0 ? (
                      <span className="text-gray-400">—</span>
                    ) : (
                      grid[day][slot].map((entry, i) => (
                        <div
                          key={i}
                          className="p-1 mb-1 rounded text-white text-xs font-medium"
                          style={{
                            backgroundColor: [
                              "#d89860",
                              "#60a5fa",
                              "#34d399",
                              "#f87171",
                              "#a78bfa",
                            ][i % 5],
                          }}
                        >
                          {entry.course?.code} [{entry.faculty?.name}]<br />
                          Room: {entry.classroom?.classroomId}
                        </div>
                      ))
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
