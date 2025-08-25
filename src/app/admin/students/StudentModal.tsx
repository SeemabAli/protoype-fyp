/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Loader2, X } from "lucide-react";

// ✅ Schema validation
const studentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  department: z.string().min(1, "Department is required"),
  semester: z.string().min(1, "Semester is required"),
  section: z.string().optional(),
});

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  selected: any;
  refresh: () => void;
}

export default function StudentModal({ open, setOpen, selected, refresh }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    registrationNumber: "",
    department: "",
    semester: "",
    section: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selected) {
      setForm({
        name: selected.name || "",
        email: selected.email || "",
        registrationNumber: selected.registrationNumber || "",
        department: selected.department || "",
        semester: selected.semester || "",
        section: selected.section || "",
      });
    } else {
      setForm({
        name: "",
        email: "",
        registrationNumber: "",
        department: "",
        semester: "",
        section: "",
      });
    }
  }, [selected]);

  const handleSave = async () => {
    const parsed = studentSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Invalid input");
      return;
    }

    setLoading(true);
    try {
      const method = selected ? "PUT" : "POST";
      const url = selected ? `/api/students/${selected._id}` : "/api/students";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save student");

      toast.success(`Student ${selected ? "updated" : "created"} successfully`);
      refresh();
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-white/20 w-full max-w-md overflow-visible">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#493737] to-[#5a4444] text-white rounded-t-2xl px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {selected ? "Edit Student" : "Add New Student"}
          </h2>
          <button
            onClick={handleCancel}
            className="p-1 hover:bg-white/20 rounded-full transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-6 space-y-4">
          <div>
            <Label>Name *</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter student name"
              disabled={loading}
              className="border-gray-300 focus:border-[#d89860] focus:ring-[#d89860]/50"
            />
          </div>

          <div>
            <Label>Email *</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Enter student email"
              disabled={loading}
              className="border-gray-300 focus:border-[#d89860] focus:ring-[#d89860]/50"
            />
          </div>

          <div>
            <Label>Registration Number *</Label>
            <Input
              value={form.registrationNumber}
              onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
              placeholder="Enter registration number"
              disabled={loading}
              className="border-gray-300 focus:border-[#d89860] focus:ring-[#d89860]/50"
            />
          </div>

          <div>
            <Label>Department *</Label>
            <Input
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              placeholder="Enter department"
              disabled={loading}
              className="border-gray-300 focus:border-[#d89860] focus:ring-[#d89860]/50"
            />
          </div>

          <div>
            <Label>Semester *</Label>
            <Input
              value={form.semester}
              onChange={(e) => setForm({ ...form, semester: e.target.value })}
              placeholder="Enter semester"
              disabled={loading}
              className="border-gray-300 focus:border-[#d89860] focus:ring-[#d89860]/50"
            />
          </div>

          <div>
            <Label>Section</Label>
            <Input
              value={form.section}
              onChange={(e) => setForm({ ...form, section: e.target.value })}
              placeholder="Enter section (optional)"
              disabled={loading}
              className="border-gray-300 focus:border-[#d89860] focus:ring-[#d89860]/50"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end gap-2">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={
              loading || !form.name || !form.email || !form.registrationNumber || !form.department || !form.semester
            }
            className="bg-gradient-to-r from-[#d89860] to-[#e0a670] text-white px-4 py-2 rounded-md hover:shadow-lg flex items-center gap-2 transition disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
