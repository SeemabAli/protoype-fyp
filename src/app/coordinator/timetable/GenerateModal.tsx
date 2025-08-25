/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
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
      const res = await fetch("/api/timetable/generate", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate timetable");
      toast.success("Timetable generated successfully!");
      onComplete();
      setOpen(false);
    } catch (err: any) {
      console.error("Generate error:", err);
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

        <div className="px-4 py-2">
          <p className="text-sm text-gray-600">
            This will generate a timetable automatically using existing courses, faculty, classrooms, and timeslots.
            The generator attempts a simple conflict-free assignment (round-robin over preferences + available resources).
          </p>
        </div>

        <DialogFooter className="mt-4 flex gap-2">
          <button
            className="px-4 py-2 border rounded hover:bg-gray-50"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-[#d89860] text-white rounded hover:bg-[#c08850]"
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
