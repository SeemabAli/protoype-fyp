/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { facultyPreferenceSchema } from "@/lib/zodSchemas";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  courses: any[];
  currentPreferences: any;
  refresh: () => void;
  facultyId: string | undefined;
}

export default function PreferenceModal({
  open,
  setOpen,
  courses,
  currentPreferences,
  refresh,
  facultyId,
}: Props) {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentPreferences?.courses) {
      const courseIds = currentPreferences.courses.map((course: any) =>
        typeof course === "string" ? course : course._id
      );
      setSelectedCourses(courseIds);
    } else {
      setSelectedCourses([]);
    }
  }, [currentPreferences]);

  const handleCourseToggle = (courseId: string) => {
    setSelectedCourses(prev =>
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    );
  };

  const handleSave = async () => {
    if (!facultyId) {
      toast.error("Faculty ID not found");
      return;
    }

    // Validation
    const validation = facultyPreferenceSchema.safeParse({ courses: selectedCourses });
    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      const method = "POST";
      const url = `/api/preferences/faculty/${facultyId}`;

      const body = {
        courses: selectedCourses,
        submittedAt: new Date().toISOString(),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save preferences");

      toast.success(`Preferences ${currentPreferences ? "updated" : "saved"} successfully`);
      refresh();
      setOpen(false);
    } catch (e: any) {
      console.error("Error saving preferences:", e);
      toast.error(e.message || "Error saving preferences");
    } finally {
      setLoading(false);
    }
  };

  const selectedCoursesDetails = courses.filter(course => selectedCourses.includes(course._id));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-[#493737]">Set Course Preferences</DialogTitle>
          <p className="text-sm text-gray-600">
            Select at least 5 courses you would like to teach. You will be assigned 2-3 based on your preferences and priority.
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {/* Available Courses */}
          <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-2">
            <h3 className="font-medium text-[#493737]">Available Courses</h3>
            {courses.map(course => {
              const isSelected = selectedCourses.includes(course._id);
              return (
                <div
                  key={course._id}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    isSelected
                      ? "border-[#493737] bg-[#fdf4ec]"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                  onClick={() => handleCourseToggle(course._id)}
                >
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={isSelected} readOnly className="rounded text-[#493737]" />
                    <span className="font-medium text-[#493737]">{course.code}</span>
                  </div>
                  <h4 className="font-medium mt-1">{course.name}</h4>
                  <p className="text-sm text-gray-600">{course.department}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">{course.creditHours} credit hours</span>
                    <span className="text-xs text-gray-500">{course.enrollment} students</span>
                    {course.multimediaRequired && (
                      <span className="bg-[#d89860]/20 text-[#d89860] px-1 py-0.5 rounded text-xs">Multimedia</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Courses Preview */}
          <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-2">
            <h3 className="font-medium text-[#493737]">Your Selected Preferences</h3>
            {selectedCoursesDetails.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No courses selected yet</p>
                <p className="text-sm mt-1">Select courses from the left panel</p>
              </div>
            ) : (
              selectedCoursesDetails.map((course, index) => (
                <div key={course._id} className="border border-[#d89860] rounded-lg p-3 bg-[#fdf4ec] flex justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#493737] text-white px-2 py-1 rounded text-xs font-medium">#{index + 1}</span>
                      <span className="font-medium text-[#493737]">{course.code}</span>
                    </div>
                    <h4 className="font-medium mt-1">{course.name}</h4>
                    <p className="text-sm text-gray-600">{course.department}</p>
                  </div>
                  <button
                    onClick={() => handleCourseToggle(course._id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="flex gap-2 pt-4 border-t">
          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={loading}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || selectedCourses.length < 5}
            className="bg-[#493737] text-white px-4 py-2 rounded hover:bg-[#352727] disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? "Saving..." : `Save ${selectedCourses.length} Preferences`}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
