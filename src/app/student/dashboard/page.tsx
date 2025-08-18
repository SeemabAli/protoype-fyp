/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

// Custom type matching what we added in auth.ts
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

  if (loading) return <p>Loading timetable...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">My Timetable</h1>
      {timetable.length === 0 ? (
        <p>No timetable assigned yet.</p>
      ) : (
        <table className="table-auto w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Day</th>
              <th className="border px-4 py-2">Time</th>
              <th className="border px-4 py-2">Course</th>
              <th className="border px-4 py-2">Classroom</th>
            </tr>
          </thead>
          <tbody>
            {timetable.map((t, idx) => (
              <tr key={idx}>
                <td className="border px-4 py-2">{t.day}</td>
                <td className="border px-4 py-2">
                  {t.timeSlot?.start} - {t.timeSlot?.end}
                </td>
                <td className="border px-4 py-2">{t.course?.title}</td>
                <td className="border px-4 py-2">{t.classroom?.classroomId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
