/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/teacher/preferences/PreferencesModal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { coursePreferencesSchema } from "@/models/Faculty";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";

interface PreferencesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  facultyId: string;
  refresh?: () => void;
}

export default function PreferencesModal({
  open,
  setOpen,
  facultyId,
  refresh,
}: PreferencesModalProps) {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<
    { courseId: string; timeSlots: string[] }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // fetch offered courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/offered-courses");
      if (!res.ok) {
        throw new Error(`Failed to fetch courses: ${res.status}`);
      }
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
      
      if (!Array.isArray(data) || data.length === 0) {
        setError("No courses are currently available for selection");
      }
    } catch (error: any) {
      console.error("Fetch courses error:", error);
      setError(error.message || "Failed to fetch courses");
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && facultyId) {
      fetchCourses();
      // Reset selections when modal opens
      setSelectedPreferences([]);
    }
  }, [open, facultyId]);

  // toggle course selection
  const toggleCourse = (courseId: string) => {
    if (selectedPreferences.some((pref) => pref.courseId === courseId)) {
      setSelectedPreferences((prev) =>
        prev.filter((pref) => pref.courseId !== courseId)
      );
    } else {
      if (selectedPreferences.length >= 5) {
        toast.error("You can select only 5 courses");
        return;
      }
      setSelectedPreferences((prev) => [
        ...prev,
        { courseId, timeSlots: [] },
      ]);
    }
  };

  // toggle timeslot for a course
  const toggleTimeSlot = (courseId: string, slot: string) => {
    setSelectedPreferences((prev) =>
      prev.map((pref) =>
        pref.courseId === courseId
          ? {
              ...pref,
              timeSlots: pref.timeSlots.includes(slot)
                ? pref.timeSlots.filter((s) => s !== slot)
                : [...pref.timeSlots, slot],
            }
          : pref
      )
    );
  };

  const availableSlots = [
    "Monday 9:00-10:30",
    "Monday 11:00-12:30",
    "Tuesday 9:00-10:30",
    "Tuesday 11:00-12:30",
    "Wednesday 9:00-10:30",
    "Wednesday 11:00-12:30",
    "Thursday 9:00-10:30",
    "Thursday 11:00-12:30",
  ];

  // save preferences
  const handleSave = async () => {
    if (selectedPreferences.length < 5) {
      toast.error("Please select exactly 5 course preferences");
      return;
    }

    // optional: ensure each course has at least 1 timeslot
    for (const pref of selectedPreferences) {
      if (pref.timeSlots.length === 0) {
        toast.error("Each selected course must have at least 1 timeslot");
        return;
      }
    }

    const parsed = coursePreferencesSchema.safeParse({
      preferences: selectedPreferences,
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Invalid selection");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(`/api/faculty/${facultyId}/preferences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: selectedPreferences }),
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save preferences");
      }
      
      toast.success("Preferences saved successfully!");
      setOpen(false);
      if (refresh) refresh();
    } catch (err: any) {
      console.error("Save preferences error:", err);
      toast.error(err.message || "Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (saving) {
      toast.error("Please wait while saving...");
      return;
    }
    setOpen(false);
    setSelectedPreferences([]);
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[85vh] overflow-hidden flex flex-col max-w-4xl">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl">
            Select <span className="font-bold text-blue-600">exactly 5</span> course preferences
          </DialogTitle>
          <div className="flex items-center gap-4 mt-2">
            <div className="text-sm text-gray-600">
              Selected: <span className="font-medium">{selectedPreferences.length}/5</span>
            </div>
            <div className="text-sm text-gray-600">
              Progress: <span className="font-medium">{Math.round((selectedPreferences.length / 5) * 100)}%</span>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
              <p className="text-gray-600">Loading available courses...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <XCircle className="w-8 h-8 text-red-500 mb-3" />
              <p className="text-red-600 text-center">{error}</p>
              <button
                onClick={fetchCourses}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Courses List */}
          {!loading && !error && courses.length > 0 && (
            <div className="space-y-4 p-1">
              {courses.map((course) => {
                const isSelected = selectedPreferences.some(
                  (pref) => pref.courseId === course._id
                );
                const currentPref = selectedPreferences.find(
                  (pref) => pref.courseId === course._id
                );

                return (
                  <div
                    key={course._id}
                    className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                      isSelected 
                        ? "bg-blue-50 border-blue-300 shadow-md" 
                        : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <div
                      className="cursor-pointer font-medium flex items-center justify-between"
                      onClick={() => toggleCourse(course._id)}
                    >
                      <div className="flex items-center gap-3">
                        {isSelected ? (
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                        )}
                        <span className="text-lg">{course.code} - {course.title}</span>
                      </div>
                      {isSelected && currentPref && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {currentPref.timeSlots.length} slot{currentPref.timeSlots.length !== 1 ? 's' : ''} selected
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {isSelected && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-3">
                          Select your preferred time slots:
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {availableSlots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                                currentPref?.timeSlots.includes(slot)
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                              }`}
                              onClick={() => toggleTimeSlot(course._id, slot)}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                        {currentPref?.timeSlots.length === 0 && (
                          <p className="text-red-500 text-sm mt-2">
                            Please select at least one time slot for this course
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter className="flex-shrink-0 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {selectedPreferences.length === 5 ? (
              <span className="text-green-600 font-medium">✓ Ready to save</span>
            ) : (
              <span>Select {5 - selectedPreferences.length} more course{5 - selectedPreferences.length !== 1 ? 's' : ''}</span>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={saving}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || selectedPreferences.length !== 5 || selectedPreferences.some(p => p.timeSlots.length === 0)}
              className={`px-6 py-2 rounded font-medium transition-colors flex items-center gap-2 ${
                saving || selectedPreferences.length !== 5 || selectedPreferences.some(p => p.timeSlots.length === 0)
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}