/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/admin/faculty/FacultyModal.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { facultySchema } from "@/lib/zodSchemas";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Loader2, X } from "lucide-react";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  selected: any;
  refresh: () => void;
}

type CourseOption = { id: string; label: string };

const DESIGNATION_OPTIONS = [
  "Lecturer",
  "Assistant Professor",
  "Associate Professor",
  "Professor",
];

export default function FacultyModal({ open, setOpen, selected, refresh }: Props) {
  const [form, setForm] = useState<any>({
    facultyId: "",
    name: "",
    department: "",
    designation: "Lecturer",
    coursePreferences: [] as string[], // store ids here (e.g., codes)
    timePreferences: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<CourseOption[]>([]);

  // helper to normalize API response for courses
  const normalizeCourses = (raw: any[]): CourseOption[] => {
    return raw.map((c) => {
      const code = c.code ?? c.courseCode ?? c.code?.toUpperCase?.() ?? c.id ?? c._id ?? c.title ?? String(c);
      const title = c.title ?? c.name ?? "";
      const id = String(code);
      const label = title ? `${id} — ${title}` : `${id}`;
      return { id, label };
    });
  };

  // Fetch available courses (robust to both array and { success, data })
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses", { cache: "no-store" });
        const json = await res.json();
        const list = Array.isArray(json) ? json : json?.success ? json.data : json.data ?? [];
        const mapped = normalizeCourses(list);
        setCourses(mapped);
      } catch (err) {
        console.error("fetchCourses error:", err);
        setCourses([]);
      }
    };
    fetchCourses();
  }, []);

  // When editing, normalize incoming selected.coursePreferences into our id format if possible
  useEffect(() => {
    if (selected) {
      const incomingPrefs: string[] = Array.isArray(selected.coursePreferences) ? selected.coursePreferences : [];
      // Attempt to map incoming preferences to known course ids; fallback to the original value
      const normalizedPrefs = incomingPrefs.map((pref) => {
        // if pref matches directly an id or label, keep id
        const found = courses.find((c) => c.id === pref || c.label === pref || c.label.startsWith(pref));
        return found ? found.id : pref;
      });
      setForm({
        facultyId: selected.facultyId || "",
        name: selected.name || "",
        department: selected.department || "",
        designation: selected.designation || "Lecturer",
        coursePreferences: normalizedPrefs,
        timePreferences: selected.timePreferences || [],
      });
    } else {
      setForm({
        facultyId: "",
        name: "",
        department: "",
        designation: "Lecturer",
        coursePreferences: [],
        timePreferences: [],
      });
    }
     
  }, [selected, courses]);

  const handleSave = async () => {
    // zod validation
    const parsed = facultySchema.safeParse({
      facultyId: form.facultyId,
      name: form.name,
      department: form.department,
      designation: form.designation,
      coursePreferences: form.coursePreferences,
      timePreferences: form.timePreferences,
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Invalid input");
      return;
    }
    if ((form.coursePreferences || []).length < 5) {
      toast.error("At least 5 course preferences are required");
      return;
    }

    setLoading(true);
    try {
      const method = selected ? "PUT" : "POST";
      const url = selected ? `/api/faculty/${selected._id}` : "/api/faculty";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const data = await res.json();
      if (!res.ok) {
        // be tolerant to different error shapes
        throw new Error(data?.error || data?.message || "Save failed");
      }

      toast.success(`Faculty ${selected ? "updated" : "created"} successfully`);
      refresh();
      setOpen(false);
    } catch (err: any) {
      console.error("save faculty error:", err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // toggle by course id
  const toggleCourse = (courseId: string) => {
    setForm((prev: any) => {
      const exists = prev.coursePreferences.includes(courseId);
      return {
        ...prev,
        coursePreferences: exists
          ? prev.coursePreferences.filter((c: string) => c !== courseId)
          : [...prev.coursePreferences, courseId],
      };
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-white/20 w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#493737] to-[#5a4444] text-white rounded-t-2xl px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{selected ? "Edit Faculty" : "Add New Faculty"}</h2>
          <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-6 space-y-4">
          <div className="space-y-1">
            <Label>Faculty ID *</Label>
            <Input value={form.facultyId} onChange={(e) => setForm({ ...form, facultyId: e.target.value })} placeholder="Enter faculty ID" disabled={loading} />
          </div>

          <div className="space-y-1">
            <Label>Name *</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter faculty name" disabled={loading} />
          </div>

          <div className="space-y-1">
            <Label>Department *</Label>
            <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="Enter department" disabled={loading} />
          </div>

          <div className="space-y-1">
            <Label>Designation *</Label>
            <select value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} disabled={loading} className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#d89860]/50 transition">
              {DESIGNATION_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <Label>Course Preferences (min 5)</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-2">
              {courses.length === 0 ? (
                <div className="text-sm text-gray-500">No courses available. Add courses first.</div>
              ) : (
                courses.map((c) => (
                  <label key={c.id} className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={form.coursePreferences.includes(c.id)} onChange={() => toggleCourse(c.id)} disabled={loading} />
                    <span className="truncate">{c.label}</span>
                  </label>
                ))
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">{form.coursePreferences.length} selected (min 5 required)</p>
          </div>

          <div className="space-y-1">
            <Label>Time Preferences (optional)</Label>
            <textarea value={(form.timePreferences || []).join(", ")} onChange={(e) => setForm({ ...form, timePreferences: e.target.value.split(",").map((s) => s.trim()) })} placeholder="e.g. Monday [All Slots], Tuesday [11:00am – 12:30pm]" disabled={loading} className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-[#d89860]/50" />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end gap-2">
          <button type="button" onClick={() => setOpen(false)} disabled={loading} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition disabled:opacity-50">Cancel</button>
          <button type="button" onClick={handleSave} disabled={loading} className="bg-gradient-to-r from-[#d89860] to-[#e0a670] text-white px-4 py-2 rounded-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2 transition">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
