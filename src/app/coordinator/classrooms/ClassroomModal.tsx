/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

const classroomSchema = z.object({
  classroomId: z.string().min(2, "Classroom ID is required (e.g., B1-F0-01)"),
  building: z.string().min(2, "Building is required (e.g., Block 1)"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  multimedia: z.boolean(),
});

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  selected: any;
  refresh: () => void;
}

export default function ClassroomModal({ open, setOpen, selected, refresh }: Props) {
  const [form, setForm] = useState({
    classroomId: "",
    building: "",
    capacity: "",
    multimedia: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selected) {
      setForm({
        classroomId: selected.classroomId || "",
        building: selected.building || "",
        capacity: selected.capacity?.toString() || "",
        multimedia: selected.multimedia || false,
      });
    } else {
      setForm({
        classroomId: "",
        building: "",
        capacity: "",
        multimedia: false,
      });
    }
  }, [selected]);

  const handleSave = async () => {
    const formData = { ...form, capacity: parseInt(form.capacity) || 0 };

    const parsed = classroomSchema.safeParse(formData);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Invalid input");
      return;
    }

    setLoading(true);
    try {
      const method = selected ? "PUT" : "POST";
      const url = selected ? `/api/classrooms/${selected._id}` : "/api/classrooms";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed to ${selected ? "update" : "create"} classroom`);

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#493737]">
            {selected ? "Edit Classroom" : "Add New Classroom"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Classroom ID */}
          <div className="space-y-2">
            <Label htmlFor="classroomId">Classroom ID *</Label>
            <Input
              id="classroomId"
              value={form.classroomId}
              onChange={(e) => setForm({ ...form, classroomId: e.target.value })}
              placeholder="e.g., B1-F0-01"
              disabled={loading}
            />
            <p className="text-xs text-gray-500">
              Format: Building-Floor-Room (e.g., B1-F0-01 for Block 1, Floor 0, Room 01)
            </p>
          </div>

          {/* Building */}
          <div className="space-y-2">
            <Label htmlFor="building">Building *</Label>
            <Input
              id="building"
              value={form.building}
              onChange={(e) => setForm({ ...form, building: e.target.value })}
              placeholder="e.g., Block 1"
              disabled={loading}
            />
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <Label htmlFor="capacity">Seating Capacity *</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              max="500"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              placeholder="e.g., 50, 70"
              disabled={loading}
            />
            <p className="text-xs text-gray-500">
              Maximum number of students this classroom can accommodate
            </p>
          </div>

          {/* Multimedia */}
          <div className="space-y-2">
            <Label className="text-base">Multimedia Availability</Label>
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="multimedia"
                  checked={form.multimedia === true}
                  onChange={() => setForm({ ...form, multimedia: true })}
                  disabled={loading}
                  className="text-[#d89860]"
                />
                <span className="text-sm">Yes - Has multimedia equipment</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="multimedia"
                  checked={form.multimedia === false}
                  onChange={() => setForm({ ...form, multimedia: false })}
                  disabled={loading}
                  className="text-[#d89860]"
                />
                <span className="text-sm">No - No multimedia equipment</span>
              </label>
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
            disabled={loading || !form.classroomId || !form.building || !form.capacity}
            className="bg-[#d89860] text-white px-4 py-2 rounded hover:bg-[#c08850] disabled:opacity-50 flex items-center gap-2"
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
