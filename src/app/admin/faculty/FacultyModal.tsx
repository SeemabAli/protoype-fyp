
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Removed Select import - using regular HTML select instead
import { facultySchema } from "@/lib/zodSchemas";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

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
  { value: "Professor", label: "Professor" }
];

export default function FacultyModal({ open, setOpen, selected, refresh }: Props) {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    department: "", 
    designation: "Lecturer" 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selected) {
      setForm({
        name: selected.name || "",
        email: selected.email || "",
        department: selected.department || "",
        designation: selected.designation || "Lecturer"
      });
    } else {
      setForm({ 
        name: "", 
        email: "", 
        department: "", 
        designation: "Lecturer" 
      });
    }
  }, [selected]);

  const handleSave = async () => {
    // Validate form data
    const parsed = facultySchema.safeParse(form);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Invalid input";
      toast.error(firstError);
      return;
    }

    setLoading(true);
    
    try {
      const method = selected ? "PUT" : "POST";
      const url = selected ? `/api/faculty/${selected._id}` : "/api/faculty";
      
      console.log(`${method} ${url}`, form); // Debug log
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("Response:", data); // Debug log

      if (!res.ok) {
        throw new Error(data.message || `Failed to ${selected ? 'update' : 'create'} faculty`);
      }

      toast.success(`Faculty ${selected ? "updated" : "created"} successfully`);
      refresh();
      setOpen(false);
      
      // Reset form if creating new faculty
      if (!selected) {
        setForm({ name: "", email: "", department: "", designation: "Lecturer" });
      }
      
    } catch (err: any) {
      console.error("Error saving faculty:", err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    // Reset form to original values
    if (selected) {
      setForm({
        name: selected.name || "",
        email: selected.email || "",
        department: selected.department || "",
        designation: selected.designation || "Lecturer"
      });
    } else {
      setForm({ name: "", email: "", department: "", designation: "Lecturer" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{selected ? "Edit Faculty" : "Add New Faculty"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter faculty name"
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Enter faculty email"
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Input
              id="department"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              placeholder="Enter department"
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="designation">Designation *</Label>
            <select
              id="designation"
              value={form.designation}
              onChange={(e) => setForm({ ...form, designation: e.target.value })}
              disabled={loading}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {DESIGNATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
            disabled={loading || !form.name || !form.email || !form.department}
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