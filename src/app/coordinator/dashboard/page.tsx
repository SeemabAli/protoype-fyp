/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function CoordinatorDashboard() {
  const [loading, setLoading] = useState(false);

  const handleGenerateTimetable = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/timetable/generate", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        toast.success("Timetable generated successfully!");
      } else {
        toast.error(data.message || "Failed to generate timetable");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Button
  onClick={handleGenerateTimetable}
  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
>
  Generate Timetable
</Button>

    </div>
  );
}
