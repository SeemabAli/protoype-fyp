/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

const classroomSchema = z.object({
  name: z.string().min(2, "Classroom name is required (e.g., B1-F0-01)"),
  location: z.string().min(2, "Building/Location is required (e.g., Block 1)"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  hasMultimedia: z.boolean(),
});

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  selected: any;
  refresh: () => void;
}

export default function ClassroomModal({ open, setOpen, selected, refresh }: Props) {
  const [form, setForm] = useState({
    name: "",
    location: "",
    capacity: "",
    hasMultimedia: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selected) {
      setForm({
        name: selected.name || "",
        location: selected.location || "",
        capacity: selected.capacity?.toString() || "",
        hasMultimedia: selected.hasMultimedia || false,
      });
    } else {
      setForm({
        name: "",
        location: "",
        capacity: "",
        hasMultimedia: false,
      });
    }
  }, [selected]);

  const handleSave = async () => {
    // Convert capacity to number for validation
    const formData = {
      ...form,
      capacity: parseInt(form.capacity) || 0,
    };

    const parsed = classroomSchema.safeParse(formData);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Invalid input");
      return;
    }

    setLoading(true);
    try {
      const method = selected ? "PUT" : "POST";
      const url = selected ? `/api/classrooms?id=${selected._id}` : "/api/classrooms";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed to ${selected ? 'update' : 'create'} classroom`);

      toast.success(`Classroom ${selected ? "updated" : "created"} successfully`);
      refresh();
      setOpen(false);
    } catch (e: any) {
      console.error("Error saving classroom:", e);
      toast.error(e.message || "Error saving classroom");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    // Reset form
    if (selected) {
      setForm({
        name: selected.name || "",
        location: selected.location || "",
        capacity: selected.capacity?.toString() || "",
        hasMultimedia: selected.hasMultimedia || false,
      });
    } else {
      setForm({
        name: "",
        location: "",
        capacity: "",
        hasMultimedia: false,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{selected ? "Edit Classroom" : "Add New Classroom"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Classroom ID *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., B1-F0-01, B1-F1-01"
              disabled={loading}
            />
            <p className="text-xs text-gray-500">
              Format: Building-Floor-Room (e.g., B1-F0-01 for Block 1, Floor 0, Room 01)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Building/Location *</Label>
            <Input
              id="location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g., Block 1, Block 2, Main Building"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Seating Capacity *</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              max="500"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              placeholder="e.g., 50, 70, 80"
              disabled={loading}
            />
            <p className="text-xs text-gray-500">
              Maximum number of students this classroom can accommodate
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-base">Multimedia Availability</Label>
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="multimedia"
                  checked={form.hasMultimedia === true}
                  onChange={() => setForm({ ...form, hasMultimedia: true })}
                  disabled={loading}
                  className="text-blue-600"
                />
                <span className="text-sm">Yes - Has multimedia equipment</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="multimedia"
                  checked={form.hasMultimedia === false}
                  onChange={() => setForm({ ...form, hasMultimedia: false })}
                  disabled={loading}
                  className="text-blue-600"
                />
                <span className="text-sm">No - No multimedia equipment</span>
              </label>
            </div>
            <p className="text-xs text-gray-500">
              Does this classroom have projector, speakers, and other multimedia equipment?
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
            disabled={loading || !form.name || !form.location || !form.capacity}
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