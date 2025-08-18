/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  selected: any;
  refresh: () => void;
}

export default function DeleteModal({ open, setOpen, selected, refresh }: Props) {
  const handleDelete = async () => {
    if (!selected?._id) return toast.error("No student selected");

    try {
      const res = await fetch(`/api/students/${selected._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Student deleted successfully");
      refresh();
      setOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Error deleting student");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Student</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete <b>{selected?.name}</b>?</p>
        <DialogFooter>
          <button onClick={() => setOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
