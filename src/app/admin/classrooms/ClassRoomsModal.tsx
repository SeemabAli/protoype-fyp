/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { classroomSchema } from "@/lib/zodSchemas";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function ClassroomModal({ open, setOpen, selected, refresh }: any) {
  const [form, setForm] = useState({ classroomId: "", building: "", capacity: 0, multimedia: false });

  useEffect(() => {
    if (selected) {
      setForm(selected);
    } else {
      setForm({ classroomId: "", building: "", capacity: 0, multimedia: false });
    }
  }, [selected]);

  const handleSave = async () => {
    const parsed = classroomSchema.safeParse({ ...form, capacity: Number(form.capacity) });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    try {
      const method = selected ? "PUT" : "POST";
      const url = selected ? `/api/classrooms/${selected._id}` : "/api/classrooms";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) throw new Error();

      toast.success(`Classroom ${selected ? "updated" : "added"} successfully`);
      refresh();
      setOpen(false);
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{selected ? "Edit Classroom" : "Add Classroom"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Classroom ID</Label>
            <Input value={form.classroomId} onChange={(e) => setForm({ ...form, classroomId: e.target.value })} />
          </div>
          <div>
            <Label>Building</Label>
            <Input value={form.building} onChange={(e) => setForm({ ...form, building: e.target.value })} />
          </div>
          <div>
            <Label>Capacity</Label>
            <Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
          </div>
          <div>
            <Label>Multimedia Available</Label>
            <input
              type="checkbox"
              checked={form.multimedia}
              onChange={(e) => setForm({ ...form, multimedia: e.target.checked })}
            />
          </div>
        </div>

        <DialogFooter>
          <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
