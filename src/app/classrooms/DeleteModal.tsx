/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import toast from "react-hot-toast";

export default function DeleteModal({ open, setOpen, selected, refresh }: any) {
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/classrooms/${selected._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      toast.success("Classroom deleted");
      setOpen(false);
      refresh();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Classroom</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete <b>{selected?.classroomId}</b>?</p>
        <DialogFooter>
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 rounded-xl border border-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-xl bg-red-600 text-white"
          >
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
