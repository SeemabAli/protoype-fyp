/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface CustomSessionUser {
  id: string;
  email: string;
  role: "admin" | "coordinator" | "faculty" | "student";
  batch?: string;
  name?: string | null;
  image?: string | null;
}

interface TimetableEntry {
  day: string;
  studentBatch: string;
  timeSlot: { start: string; end: string };
  course: { title: string };
  classroom: { classroomId: string };
}

export default function StudentDashboardPage() {
  const { data: sessionData } = useSession();
  const session = sessionData?.user as CustomSessionUser | undefined;

  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await fetch("/api/timetable/fetch");
        const data = await res.json();

        if (!session?.batch) return;

        const filtered: TimetableEntry[] = (data.timetable || []).filter(
          (t: any) => t.studentBatch === session.batch
        );

        setTimetable(filtered);
      } catch (err) {
        console.error("Error fetching timetable:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [session]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">My Timetable</h1>

      {timetable.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No timetable assigned yet.</p>
          <p className="mt-2 text-sm">Please check back later.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {timetable.map((t, idx) => (
            <div
              key={idx}
              className="bg-white shadow rounded-xl p-4 border border-gray-200 hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500 font-medium">{t.day}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {t.timeSlot?.start} - {t.timeSlot?.end}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{t.course?.title}</h3>
              <p className="text-sm text-gray-600 mt-1">Classroom: {t.classroom?.classroomId}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
