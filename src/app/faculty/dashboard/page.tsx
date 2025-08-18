/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function FacultyDashboardPage() {
  const { data: session } = useSession();
  const [timetable, setTimetable] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimetable = async () => {
      const res = await fetch("/api/timetable/fetch");
      const data = await res.json();

      // Filter timetable entries assigned to this faculty
      const filtered = (data.timetable || []).filter(
        (t: any) => t.faculty?._id === session?.user?.id
      );

      setTimetable(filtered);
      setLoading(false);
    };

    if (session?.user?.id) fetchTimetable();
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
              <th className="border px-4 py-2">Batch</th>
            </tr>
          </thead>
          <tbody>
            {timetable.map((t: any, idx: number) => (
              <tr key={idx}>
                <td className="border px-4 py-2">{t.day}</td>
                <td className="border px-4 py-2">{t.timeSlot?.start} - {t.timeSlot?.end}</td>
                <td className="border px-4 py-2">{t.course?.title}</td>
                <td className="border px-4 py-2">{t.classroom?.classroomId}</td>
                <td className="border px-4 py-2">{t.studentBatch}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
