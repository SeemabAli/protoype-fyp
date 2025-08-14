/* eslint-disable @typescript-eslint/no-unused-vars */
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
    if (!selected?._id) {
      toast.error("No faculty selected");
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selected.name}?`)) return;

    try {
      const res = await fetch(`/api/faculty/${selected._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Faculty deleted successfully");
      refresh(); // ✅ Refresh list after delete
      setOpen(false); // ✅ Close modal after delete
    } catch (error) {
      toast.error("Error deleting faculty");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Faculty</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete <b>{selected?.name}</b>?</p>
        <DialogFooter>
          <button
            onClick={() => setOpen(false)}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete} // ✅ no parameter, uses selected._id
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
