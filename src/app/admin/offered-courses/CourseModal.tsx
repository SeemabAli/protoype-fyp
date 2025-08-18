/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

const courseSchema = z.object({
  code: z.string().min(2, "Course code is required (e.g., CS201)"),
  name: z.string().min(3, "Course name is required"),
  department: z.string().min(2, "Department is required"),
  creditHours: z.number().min(1, "Credit hours must be at least 1").max(6, "Credit hours cannot exceed 6"),
  enrollment: z.number().min(0, "Enrollment cannot be negative"),
  multimediaRequired: z.boolean(),
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
    name: "",
    department: "",
    creditHours: "3",
    enrollment: "",
    multimediaRequired: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selected) {
      setForm({
        code: selected.code || "",
        name: selected.name || "",
        department: selected.department || "",
        creditHours: selected.creditHours?.toString() || "3",
        enrollment: selected.enrollment?.toString() || "",
        multimediaRequired: selected.multimediaRequired || false,
      });
    } else {
      setForm({
        code: "",
        name: "",
        department: "",
        creditHours: "3",
        enrollment: "",
        multimediaRequired: false,
      });
    }
  }, [selected]);

    const handleSave = async () => {
    // Convert string fields to appropriate types
    const formData = {
      ...form,
      creditHours: parseInt(form.creditHours) || 0,
      enrollment: parseInt(form.enrollment) || 0,
    };

    const parsed = courseSchema.safeParse(formData);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Invalid input");
      return;
    }

    setLoading(true);
    try {
      const method = selected ? "PUT" : "POST";
      const url = selected ? `/api/courses?id=${selected._id}` : "/api/courses";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed to ${selected ? 'update' : 'create'} course`);

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

  const handleCancel = () => {
    setOpen(false);
    // Reset form
    if (selected) {
      setForm({
        code: selected.code || "",
        name: selected.name || "",
        department: selected.department || "",
        creditHours: selected.creditHours?.toString() || "3",
        enrollment: selected.enrollment?.toString() || "",
        multimediaRequired: selected.multimediaRequired || false,
      });
    } else {
      setForm({
        code: "",
        name: "",
        department: "",
        creditHours: "3",
        enrollment: "",
        multimediaRequired: false,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{selected ? "Edit Course" : "Add New Course"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Course Code *</Label>
              <Input
                id="code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="e.g., CS201, CS301"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <select
                id="department"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                disabled={loading}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="English">English</option>
                <option value="Management Sciences">Management Sciences</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Course Title *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Introduction to Programming, Data Structures"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="creditHours">Credit Hours *</Label>
              <select
                id="creditHours"
                value={form.creditHours}
                onChange={(e) => setForm({ ...form, creditHours: e.target.value })}
                disabled={loading}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="1">1 Credit Hour</option>
                <option value="2">2 Credit Hours</option>
                <option value="3">3 Credit Hours</option>
                <option value="4">4 Credit Hours</option>
                <option value="5">5 Credit Hours</option>
                <option value="6">6 Credit Hours</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="enrollment">Student Enrollment *</Label>
              <Input
                id="enrollment"
                type="number"
                min="0"
                max="200"
                value={form.enrollment}
                onChange={(e) => setForm({ ...form, enrollment: e.target.value })}
                placeholder="e.g., 85, 65, 48"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-base">Multimedia Requirements</Label>
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="multimedia"
                  checked={form.multimediaRequired === true}
                  onChange={() => setForm({ ...form, multimediaRequired: true })}
                  disabled={loading}
                  className="text-blue-600"
                />
                <span className="text-sm">Yes - Requires multimedia classroom</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="multimedia"
                  checked={form.multimediaRequired === false}
                  onChange={() => setForm({ ...form, multimediaRequired: false })}
                  disabled={loading}
                  className="text-blue-600"
                />
                <span className="text-sm">No - Standard classroom is fine</span>
              </label>
            </div>
            <p className="text-xs text-gray-500">
              Does this course require projector, speakers, and multimedia equipment?
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || !form.code || !form.name || !form.department || !form.enrollment}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {loading ? "Saving..." : "Save"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}