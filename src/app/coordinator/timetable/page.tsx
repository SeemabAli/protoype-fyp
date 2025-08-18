/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import GenerateModal from "./GenerateModal";
import toast from "react-hot-toast";

interface TimetableEntry {
  _id: string;
  course: { title: string; code: string };
  faculty: { name: string };
  classroom: { classroomId: string; building: string };
  day: string;
  timeSlot: { start: string; end: string };
  studentBatch: string;
}

export default function AutoTimetablePage() {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auto-timetable/fetch");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch timetable");
      setTimetable(data.timetable);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error fetching timetable");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Coordinator Timetable</h1>
      <button
        onClick={() => setModalOpen(true)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Generate Timetable
      </button>

      <GenerateModal open={modalOpen} setOpen={setModalOpen} onComplete={fetchTimetable} />

      {loading ? (
        <div className="text-gray-500">Loading timetable...</div>
      ) : timetable.length === 0 ? (
        <div className="text-gray-500">No timetable generated yet</div>
      ) : (
        <Table className="w-full border">
          <TableHeader>
            <TableRow>
              <TableHead>Day</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Faculty</TableHead>
              <TableHead>Classroom</TableHead>
              <TableHead>Batch</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timetable.map(entry => (
              <TableRow key={entry._id}>
                <TableCell>{entry.day}</TableCell>
                <TableCell>{entry.timeSlot.start} - {entry.timeSlot.end}</TableCell>
                <TableCell>{entry.course.code} - {entry.course.title}</TableCell>
                <TableCell>{entry.faculty.name}</TableCell>
                <TableCell>{entry.classroom.classroomId} ({entry.classroom.building})</TableCell>
                <TableCell>{entry.studentBatch}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
