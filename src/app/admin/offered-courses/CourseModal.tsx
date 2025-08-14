/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { courseSchema } from "@/lib/zodSchemas";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function CourseModal({ open, setOpen, selected, refresh }: any) {
  const [form, setForm] = useState({ code: "", title: "", enrollment: "", multimediaRequired: false });

  useEffect(() => {
    if (selected) {
      setForm(selected);
    } else {
      setForm({ code: "", title: "", enrollment: "", multimediaRequired: false });
    }
  }, [selected]);

  const handleSave = async () => {
    const parsed = courseSchema.safeParse({ ...form, enrollment: Number(form.enrollment) });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    try {
      const method = selected ? "PUT" : "POST";
      const url = selected ? `/api/offered-courses/${selected._id}` : "/api/offered-courses";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error();
      toast.success(`Course ${selected ? "updated" : "added"} successfully`);
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
          <DialogTitle>{selected ? "Edit Course" : "Add Course"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Course Code</Label>
            <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          </div>
          <div>
            <Label>Course Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <Label>Enrollment</Label>
            <Input type="number" value={form.enrollment} onChange={(e) => setForm({ ...form, enrollment: e.target.value })} />
          </div>
          <div>
            <Label>Multimedia Required</Label>
            <input
              type="checkbox"
              checked={form.multimediaRequired}
              onChange={(e) => setForm({ ...form, multimediaRequired: e.target.checked })}
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
