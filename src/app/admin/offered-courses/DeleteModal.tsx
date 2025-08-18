/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  selected: any;
  refresh: () => void;
}

export default function DeleteModal({ open, setOpen, selected, refresh }: Props) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!selected?._id) {
      toast.error("No course selected");
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/courses?id=${selected._id}`, { 
        method: "DELETE" 
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete course");

      toast.success("Course deleted successfully");
      refresh();
      setOpen(false);
    } catch (e: any) {
      console.error("Error deleting course:", e);
      toast.error(e.message || "Error deleting course");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">Delete Course</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-gray-700">
            Are you sure you want to delete course{" "}
            <span className="font-semibold text-blue-600">
              {selected?.code} - {selected?.name}
            </span>?
          </p>
          <div className="mt-3 p-3 bg-red-50 rounded-md">
            <div className="text-sm text-red-800">
              <strong>Warning:</strong> This action cannot be undone. 
              {selected?.enrollment && (
                <span> This will affect {selected.enrollment} enrolled students.</span>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={deleting}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {deleting && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {deleting ? "Deleting..." : "Delete Course"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}