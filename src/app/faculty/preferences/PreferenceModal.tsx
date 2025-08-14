"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { preferenceSchema } from "@/lib/zodSchemas";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface PreferenceModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  facultyId: string;
  refresh: () => void;
}

export default function PreferenceModal({ open, setOpen, facultyId, refresh }: PreferenceModalProps) {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [courses, setCourses] = useState<any[]>([]);

  // Fetch offered courses
  const fetchCourses = async () => {
    const res = await fetch("/api/offered-courses");
    const data = await res.json();
    setCourses(data);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const toggleTimeSlot = (slot: string) => {
  if (timeSlots.includes(slot)) {
    setTimeSlots(timeSlots.filter(s => s !== slot));
  } else {
    if (timeSlots.length >= 3) {
      toast.error("You can select only 3 preferences");
      return;
    }
    setTimeSlots([...timeSlots, slot]);
  }
};


  const handleSave = async () => {
  if (timeSlots.length === 0) {
    toast.error("Please select at least one time slot");
    return;
  }

  const parsed = preferenceSchema.safeParse({
    facultyId,
    courseCode: selectedCourse,
    timePreferences: timeSlots,
  });

  if (!parsed.success) {
    toast.error(parsed.error.issues[0].message);
    return;
  }

  try {
    const res = await fetch("/api/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        facultyId,
        courseCode: selectedCourse,
        timePreferences: timeSlots,
      }),
    });

    if (!res.ok) throw new Error();
    toast.success("Preferences saved successfully");

    setOpen(false);
    setSelectedCourse("");
    setTimeSlots([]);

    // 🔹 Immediately refresh list after saving
    refresh();
  } catch {
    toast.error("Something went wrong");
  }
};



  const availableSlots = [
    "Monday 9:00-10:30", "Monday 11:00-12:30",
    "Tuesday 9:00-10:30", "Tuesday 11:00-12:30",
    "Wednesday 9:00-10:30", "Wednesday 11:00-12:30",
    "Thursday 9:00-10:30", "Thursday 11:00-12:30",
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Course Preferences</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label>Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Select a course</option>
              {courses.map(c => (
                <option key={c._id} value={c.code}>{c.code} - {c.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Time Slots</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {availableSlots.map(slot => (
                <button
                  key={slot}
                  type="button"
                  className={`px-2 py-1 border rounded ${timeSlots.includes(slot) ? "bg-blue-600 text-white" : ""}`}
                  onClick={() => toggleTimeSlot(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
            Save Preferences
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
