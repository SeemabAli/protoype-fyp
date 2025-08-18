/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { Loader2, X } from "lucide-react";

const studentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  registrationNumber: z.string().min(1, "Registration number required"),
});

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  selected: any;
  refresh: () => void;
}

export default function StudentModal({ open, setOpen, selected, refresh }: Props) {
  const [form, setForm] = useState({ name: "", email: "", registrationNumber: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selected) {
      setForm({
        name: selected.name || "",
        email: selected.email || "",
        registrationNumber: selected.registrationNumber || "",
      });
    } else {
      setForm({ name: "", email: "", registrationNumber: "" });
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
      if (!res.ok) throw new Error(data.message || "Failed to save");

      toast.success(`Student ${selected ? "updated" : "created"} successfully`);
      refresh();
      setOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Error saving student");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-white/20 w-full max-w-md overflow-visible">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#493737] to-[#5a4444] text-white rounded-t-2xl px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{selected ? "Edit Student" : "Add Student"}</h2>
          <button
            onClick={() => setOpen(false)}
            className="p-1 hover:bg-white/20 rounded-full transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-4">
          <div className="space-y-1">
            <Label>Name *</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={loading}
              className="border-gray-300 focus:border-[#d89860] focus:ring-[#d89860]/50"
            />
          </div>
          <div className="space-y-1">
            <Label>Email *</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={loading}
              className="border-gray-300 focus:border-[#d89860] focus:ring-[#d89860]/50"
            />
          </div>
          <div className="space-y-1">
            <Label>Registration Number *</Label>
            <Input
              value={form.registrationNumber}
              onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
              disabled={loading}
              className="border-gray-300 focus:border-[#d89860] focus:ring-[#d89860]/50"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end gap-2">
          <button
            onClick={() => setOpen(false)}
            disabled={loading}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !form.name || !form.email || !form.registrationNumber}
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
