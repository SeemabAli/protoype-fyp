/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  onComplete: () => void;
}

export default function GenerateModal({ open, setOpen, onComplete }: Props) {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auto-timetable/generate", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate timetable");
      toast.success("Timetable generated successfully!");
      onComplete();
      setOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error generating timetable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Timetable</DialogTitle>
        </DialogHeader>

        <p className="mt-2 text-sm text-gray-600">
          This will generate a timetable automatically using existing courses, faculty, classrooms, and timeslots.
        </p>

        <DialogFooter className="mt-4 flex gap-2">
          <button
            className="px-4 py-2 border rounded hover:bg-gray-50"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
