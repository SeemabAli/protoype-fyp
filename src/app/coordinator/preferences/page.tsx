/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import LogoutButton from "@/components/LogoutButton";
import toast from "react-hot-toast";
import PreferenceModal from "./PreferenceModal";

export default function CoordinatorPreferencesPage() {
  const [faculties, setFaculties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/preferences", { cache: "no-store" });
      const data = await res.json();
      if (res.ok) {
        setFaculties(data);
      } else {
        toast.error(data.error || "Failed to fetch preferences");
      }
    } catch (err) {
      console.error("Fetch preferences error:", err);
      toast.error("Failed to fetch preferences");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["coordinator"]}>
      {/* header */}
      <div className="bg-[#493737] text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/VU_Logo.png/960px-VU_Logo.png"
              alt="logo"
              className="w-7 h-auto"
            />
          </div>
          <span className="text-lg font-semibold">Automated Timetable System</span>
        </div>

        <button className="px-4 py-2 rounded text-sm">
          <LogoutButton />
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white p-6 rounded-xl mb-6 border-l-4 shadow-sm border-[#d89860]">
          <h1 className="text-2xl font-semibold text-[#493737]">Faculty Preferences</h1>
          <p className="text-sm text-gray-600">
            View all faculty course preferences (each faculty should submit exactly 5 preferences).
          </p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-[#493737] font-medium">Total Faculty: {faculties.length}</div>
          <button
            onClick={fetchPreferences}
            className="px-4 py-2 rounded bg-[#d89860] text-white hover:bg-[#c08850] transition"
          >
            Refresh
          </button>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#d89860]" />
              <p className="mt-2 text-gray-600">Loading preferences...</p>
            </div>
          ) : faculties.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No faculty data found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left font-medium text-gray-700 border-b">#</th>
                    <th className="p-4 text-left font-medium text-gray-700 border-b">Name</th>
                    <th className="p-4 text-left font-medium text-gray-700 border-b">Email</th>
                    <th className="p-4 text-left font-medium text-gray-700 border-b">Department</th>
                    <th className="p-4 text-left font-medium text-gray-700 border-b">Preferences</th>
                    <th className="p-4 text-center font-medium text-gray-700 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {faculties.map((f, idx) => (
                    <tr key={f._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{idx + 1}</td>
                      <td className="p-4 font-semibold text-[#493737]">{f.name}</td>
                      <td className="p-4 text-gray-600">{f.email}</td>
                      <td className="p-4 text-gray-600">{f.department}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-[#fff3e8] text-[#a86b33] rounded-full text-sm">
                          {Array.isArray(f.preferences) ? f.preferences.length : 0} submitted
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => {
                            setSelected(f);
                            setOpen(true);
                          }}
                          className="px-3 py-1 bg-[#d89860] text-white rounded hover:bg-[#c08850] transition-colors text-sm"
                        >
                          View Preferences
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        <PreferenceModal open={open} setOpen={setOpen} faculty={selected} />
      </div>
    </ProtectedRoute>
  );
}
