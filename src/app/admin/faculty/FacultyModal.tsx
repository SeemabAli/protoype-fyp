/* eslint-disable @typescript-eslint/no-explicit-any */
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

const DESIGNATION_OPTIONS = [
  { value: "Lecturer", label: "Lecturer" },
  { value: "AssistantProfessor", label: "Assistant Professor" },
  { value: "AssociateProfessor", label: "Associate Professor" },
  { value: "Professor", label: "Professor" },
];

export default function FacultyModal({ open, setOpen, selected, refresh }: Props) {
  const [form, setForm] = useState({ name: "", email: "", department: "", designation: "Lecturer" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selected) {
      setForm({
        name: selected.name || "",
        email: selected.email || "",
        department: selected.department || "",
        designation: selected.designation || "Lecturer",
      });
    } else {
      setForm({ name: "", email: "", department: "", designation: "Lecturer" });
    }
  }, [selected]);

  const handleSave = async () => {
    const parsed = facultySchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Invalid input");
      return;
    }

    setLoading(true);
    try {
      const method = selected ? "PUT" : "POST";
      const url = selected ? `/api/faculty/${selected._id}` : "/api/faculty";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Failed to ${selected ? "update" : "create"} faculty`);

      toast.success(`Faculty ${selected ? "updated" : "created"} successfully`);
      refresh();
      setOpen(false);

      if (!selected) setForm({ name: "", email: "", department: "", designation: "Lecturer" });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    if (selected) {
      setForm({
        name: selected.name || "",
        email: selected.email || "",
        department: selected.department || "",
        designation: selected.designation || "Lecturer",
      });
    } else {
      setForm({ name: "", email: "", department: "", designation: "Lecturer" });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-white/20 w-full max-w-md overflow-visible">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#493737] to-[#5a4444] text-white rounded-t-2xl px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{selected ? "Edit Faculty" : "Add New Faculty"}</h2>
          <button onClick={handleCancel} className="p-1 hover:bg-white/20 rounded-full transition">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-6 space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name" className="text-gray-700 text-sm">Name *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter faculty name"
              disabled={loading}
              className="border-gray-300 focus:border-[#d89860] focus:ring-[#d89860]/50"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-gray-700 text-sm">Email *</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Enter faculty email"
              disabled={loading}
              className="border-gray-300 focus:border-[#d89860] focus:ring-[#d89860]/50"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="department" className="text-gray-700 text-sm">Department *</Label>
            <Input
              id="department"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              placeholder="Enter department"
              disabled={loading}
              className="border-gray-300 focus:border-[#d89860] focus:ring-[#d89860]/50"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="designation" className="text-gray-700 text-sm">Designation *</Label>
            <select
              id="designation"
              value={form.designation}
              onChange={(e) => setForm({ ...form, designation: e.target.value })}
              disabled={loading}
              className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#d89860]/50 transition"
            >
              {DESIGNATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || !form.name || !form.email || !form.department}
            className="bg-gradient-to-r from-[#d89860] to-[#e0a670] text-white px-4 py-2 rounded-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2 transition"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
