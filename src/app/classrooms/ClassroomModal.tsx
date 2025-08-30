/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  selected: any;
  refresh: () => void;
}

export default function ClassroomModal({
  open,
  setOpen,
  selected,
  refresh,
}: Props) {
  const [form, setForm] = useState({
    classroomId: "",
    capacity: "",
    multimediaAvailable: false,
    building: "",
  });

  useEffect(() => {
    if (selected) {
      setForm({
        classroomId: selected.classroomId || "",
        capacity: selected.capacity || "",
        multimediaAvailable: selected.multimediaAvailable || false,
        building: selected.building || "",
      });
    } else {
      setForm({
        classroomId: "",
        capacity: "",
        multimediaAvailable: false,
        building: "",
      });
    }
  }, [selected]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const method = selected ? "PUT" : "POST";
      const url = selected
        ? `/api/classrooms/${selected._id}`
        : "/api/classrooms";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, capacity: Number(form.capacity) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      toast.success(selected ? "Classroom updated" : "Classroom added");
      setOpen(false);
      refresh();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {selected ? "Edit Classroom" : "Add Classroom"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label>Classroom ID</Label>
            <Input
              name="classroomId"
              value={form.classroomId}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Capacity</Label>
            <Input
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Building</Label>
            <Input
              name="building"
              value={form.building}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="multimediaAvailable"
              checked={form.multimediaAvailable}
              onChange={handleChange}
            />
            <Label>Multimedia Available</Label>
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d89860] to-[#e0a670] text-white"
          >
            {selected ? "Update" : "Add"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
