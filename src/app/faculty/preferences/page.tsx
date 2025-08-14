/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import PreferenceModal from "./PreferenceModal";
import { useSession } from "next-auth/react";

export default function PreferencesPage() {
  const { data: session } = useSession();
  const facultyId = session?.user?.id || "DCS23"; // fallback for testing

  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState([]);

  const fetchPreferences = async () => {
  const res = await fetch(`/api/preferences?facultyId=${facultyId}`);
  if (!res.ok) return;
  const data = await res.json();
  setPreferences(data);
};


  useEffect(() => {
    if (facultyId) {
      fetchPreferences();
    }
  }, [facultyId]);

  return (
    <ProtectedRoute allowedRoles={["faculty"]}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Course Preferences</h1>
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add / Edit Preferences
        </button>

        <table className="w-full mt-4 border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Course</th>
              <th className="p-2 border">Time Slots</th>
            </tr>
          </thead>
          <tbody>
            {preferences.map((p: any) => (
              <tr key={p._id}>
                <td className="p-2 border">{p.courseCode}</td>
                <td className="p-2 border">{p.timePreferences.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <PreferenceModal
          open={open}
          setOpen={setOpen}
          facultyId={facultyId}
          refresh={fetchPreferences}
        />
      </div>
    </ProtectedRoute>
  );
}
