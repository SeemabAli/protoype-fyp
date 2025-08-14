/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { facultySchema } from "@/lib/zodSchemas";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  selected: any;
  refresh: () => void;
}

export default function FacultyModal({ open, setOpen, selected, refresh }: Props) {
  const [form, setForm] = useState({ name: "", email: "", department: "" });

  useEffect(() => {
    if (selected) {
      setForm({
        name: selected.name,
        email: selected.email,
        department: selected.department
      });
    } else {
      setForm({ name: "", email: "", department: "" });
    }
  }, [selected]);

  const handleSave = async () => {
    const parsed = facultySchema.safeParse(form);
    if (!parsed.success) {
  const firstError = parsed.error.issues[0]?.message || "Invalid input";
  toast.error(firstError);
  return;
}
    try {
      const method = selected ? "PUT" : "POST";
      const url = selected ? `/api/faculty/${selected._id}` : "/api/faculty";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save");
      toast.success(`Faculty ${selected ? "updated" : "added"} successfully`);
      refresh();
      setOpen(false);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{selected ? "Edit Faculty" : "Add Faculty"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter faculty name"
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Enter faculty email"
            />
          </div>
          <div>
            <Label>Department</Label>
            <Input
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              placeholder="Enter department"
            />
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
