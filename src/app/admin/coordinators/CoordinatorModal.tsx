/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, X } from "lucide-react";

const coordinatorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  department: z.string().min(1, "Department is required"),
});

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  selected: any;
  refresh: () => void;
}

export default function CoordinatorModal({ open, setOpen, selected, refresh }: Props) {
  const [form, setForm] = useState({ name: "", email: "", department: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selected) {
      setForm({
        name: selected.name || "",
        email: selected.email || "",
        department: selected.department || "",
      });
    } else {
      setForm({ name: "", email: "", department: "" });
    }
  }, [selected]);

  const handleCancel = () => {
    setOpen(false);
    if (selected) {
      setForm({
        name: selected.name || "",
        email: selected.email || "",
        department: selected.department || "",
      });
    } else {
      setForm({ name: "", email: "", department: "" });
    }
  };

  const handleSave = async () => {
    const parsed = coordinatorSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Invalid input");
      return;
    }

    setLoading(true);
    try {
      const method = selected ? "PUT" : "POST";
      const url = selected ? `/api/coordinators/${selected._id}` : "/api/coordinators";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");

      toast.success(`Coordinator ${selected ? "updated" : "created"} successfully`);
      refresh();
      setOpen(false);

      if (!selected) setForm({ name: "", email: "", department: "" });
    } catch (e: any) {
      toast.error(e.message || "Error saving coordinator");
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
          <h2 className="text-lg font-semibold">
            {selected ? "Edit Coordinator" : "Add New Coordinator"}
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
          <div className="space-y-1">
            <Label htmlFor="name" className="text-gray-700 text-sm">Name *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter coordinator name"
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
              placeholder="Enter coordinator email"
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
