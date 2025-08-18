/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

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
      if (!res.ok) throw new Error(data.message);

      toast.success(`Coordinator ${selected ? "updated" : "created"} successfully`);
      refresh();
      setOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Error saving coordinator");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{selected ? "Edit Coordinator" : "Add Coordinator"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={loading} />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={loading} />
          </div>
          <div>
            <Label>Department</Label>
            <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} disabled={loading} />
          </div>
        </div>

        <DialogFooter>
          <button onClick={() => setOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={handleSave} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
            {loading ? "Saving..." : "Save"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
