/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

const courseSchema = z.object({
  code: z.string().min(2, "Course code is required (e.g., CS201)"),
  title: z.string().min(3, "Course title is required"),
  enrollment: z.number().min(1, "Enrollment must be at least 1"),
  multimediaRequired: z.boolean(),
  studentBatch: z.string().optional().nullable(),
});

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  selected: any;
  refresh: () => void;
}

export default function CourseModal({ open, setOpen, selected, refresh }: Props) {
  const [form, setForm] = useState({
    code: "",
    title: "",
    enrollment: "",
    multimediaRequired: false,
    studentBatch: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selected) {
      setForm({
        code: selected.code || "",
        title: selected.title || "",
        enrollment: selected.enrollment?.toString() || "",
        multimediaRequired: !!selected.multimediaRequired,
        studentBatch: selected.studentBatch || "",
      });
    } else {
      setForm({
        code: "",
        title: "",
        enrollment: "",
        multimediaRequired: false,
        studentBatch: "",
      });
    }
  }, [selected]);

  const handleSave = async () => {
    const payload = {
      code: form.code.toUpperCase().trim(),
      title: form.title.trim(),
      enrollment: parseInt(form.enrollment) || 0,
      multimediaRequired: form.multimediaRequired,
      studentBatch: form.studentBatch?.trim() || undefined,
    };

    const parsed = courseSchema.safeParse(payload);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Invalid input");
      return;
    }

    setLoading(true);
    try {
      const method = selected ? "PUT" : "POST";
      const url = selected ? `/api/courses/${selected._id}` : "/api/courses";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed to ${selected ? "update" : "create"} course`);

      toast.success(`Course ${selected ? "updated" : "created"} successfully`);
      refresh();
      setOpen(false);
    } catch (e: any) {
      console.error("Error saving course:", e);
      toast.error(e.message || "Error saving course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[#493737]">{selected ? "Edit Course" : "Add New Course"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Course Code *</Label>
              <Input
                id="code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="e.g., CS201"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="batch">Student Batch (optional)</Label>
              <Input
                id="batch"
                value={form.studentBatch}
                onChange={(e) => setForm({ ...form, studentBatch: e.target.value })}
                placeholder="e.g., BSCS-6A"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Course Title *</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., Data Structures"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="enrollment">Student Enrollment *</Label>
              <Input
                id="enrollment"
                type="number"
                min="1"
                max="400"
                value={form.enrollment}
                onChange={(e) => setForm({ ...form, enrollment: e.target.value })}
                placeholder="e.g., 85"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base">Multimedia Requirement</Label>
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="multimedia"
                    checked={form.multimediaRequired === true}
                    onChange={() => setForm({ ...form, multimediaRequired: true })}
                    disabled={loading}
                    className="text-[#d89860]"
                  />
                  <span className="text-sm">Requires multimedia classroom</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="multimedia"
                    checked={form.multimediaRequired === false}
                    onChange={() => setForm({ ...form, multimediaRequired: false })}
                    disabled={loading}
                    className="text-[#d89860]"
                  />
                  <span className="text-sm">Standard classroom is fine</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={loading}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || !form.code || !form.title || !form.enrollment}
            className="bg-[#d89860] text-white px-4 py-2 rounded hover:bg-[#c08850] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {loading ? "Saving..." : "Save"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
