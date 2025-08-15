/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import PreferencesModal from "./PreferenceModal";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface FacultyData {
  id: string;
  name: string;
  email: string;
  preferences?: any[];
}

export default function FacultyPreferencesPage() {
  const [facultyData, setFacultyData] = useState<FacultyData | null>(null);
  const [coursesAvailable, setCoursesAvailable] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all required data
  useEffect(() => {
    const fetchRequiredData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch faculty data
        const facultyRes = await fetch("/api/faculty");
        if (!facultyRes.ok) {
          throw new Error("Failed to fetch faculty information");
        }
        const facultyData = await facultyRes.json();
        setFacultyData(facultyData);

        // Pre-check if courses are available
        const coursesRes = await fetch("/api/offered-courses");
        if (!coursesRes.ok) {
          throw new Error("Failed to check available courses");
        }
        const coursesData = await coursesRes.json();
        setCoursesAvailable(Array.isArray(coursesData) && coursesData.length > 0);

        if (coursesData.length === 0) {
          setError("No courses available for preference selection");
        }

      } catch (error: any) {
        console.error("Error fetching required data:", error);
        setError(error.message || "Failed to load required data");
        toast.error(error.message || "Failed to load required data");
      } finally {
        setLoading(false);
      }
    };

    fetchRequiredData();
  }, []);

  const handleSetPreferences = () => {
    if (!facultyData?.id) {
      toast.error("Faculty information not loaded");
      return;
    }
    if (!coursesAvailable) {
      toast.error("No courses available for selection");
      return;
    }
    setOpen(true);
  };

  const isButtonDisabled = loading || !facultyData?.id || !coursesAvailable || !!error;

  const getButtonText = () => {
    if (loading) return "Loading...";
    if (error) return "Unable to Load";
    if (!facultyData?.id) return "Loading Faculty Data...";
    if (!coursesAvailable) return "No Courses Available";
    return "Set Preferences";
  };

  const getButtonTooltip = () => {
    if (loading) return "Loading required data...";
    if (error) return error;
    if (!facultyData?.id) return "Waiting for faculty information...";
    if (!coursesAvailable) return "No courses are currently available for preference selection";
    return "Click to set your course preferences";
  };

  return (
    <ProtectedRoute allowedRoles={["faculty"]}>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Preferences</h1>
          {facultyData && (
            <p className="text-gray-600">
              Welcome, {facultyData.name}! Select your preferred courses and time slots.
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center gap-3 mb-4 p-4 bg-blue-50 rounded-lg">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <div>
              <p className="font-medium text-blue-800">Loading...</p>
              <p className="text-sm text-blue-600">Fetching faculty data and available courses...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="font-medium text-red-800">Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Success State Info */}
        {!loading && facultyData && coursesAvailable && !error && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="font-medium text-green-800">Ready to set preferences</p>
            <p className="text-sm text-green-600">
              Faculty data loaded successfully. Courses are available for selection.
            </p>
          </div>
        )}

        {/* Warning State */}
        {!loading && facultyData && !coursesAvailable && !error && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="font-medium text-yellow-800">No Courses Available</p>
            <p className="text-sm text-yellow-600">
              There are currently no courses available for preference selection. Please contact the administrator.
            </p>
          </div>
        )}

        {/* Set Preferences Button */}
        <div className="relative group">
          <button
            type="button"
            onClick={handleSetPreferences}
            disabled={isButtonDisabled}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              isButtonDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white cursor-pointer shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            }`}
            title={getButtonTooltip()}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {getButtonText()}
          </button>
          
          {/* Tooltip on hover */}
          {isButtonDisabled && (
            <div className="absolute bottom-full left-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap z-10">
              {getButtonTooltip()}
              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
            </div>
          )}
        </div>

        {/* Current Preferences Display */}
        {facultyData?.preferences && facultyData.preferences.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3">Current Preferences</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                You have {facultyData.preferences.length} preference(s) saved.
              </p>
            </div>
          </div>
        )}
        
        {/* Modal */}
        {facultyData?.id && (
          <PreferencesModal
            open={open}
            setOpen={setOpen}
            facultyId={facultyData.id}
            refresh={() => {
              // Refresh faculty data to show updated preferences
              fetch("/api/me")
                .then((res) => res.json())
                .then((data) => setFacultyData(data))
                .catch((error) => console.error("Error refreshing faculty data:", error));
            }}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}