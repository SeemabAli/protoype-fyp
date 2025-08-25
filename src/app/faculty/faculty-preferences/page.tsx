/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ProtectedRoute from "@/components/ProtectedRoute";
import LogoutButton from "@/components/LogoutButton";
import toast from "react-hot-toast";
import PreferenceModal from "./PreferenceModal";

export default function FacultyPreferencesPage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<any[]>([]);
  const [preferences, setPreferences] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses", { cache: "no-store" });
      const data = await res.json();
      if (res.ok) {
        setCourses(data);
      } else {
        toast.error("Failed to fetch courses");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to fetch courses");
    }
  };

  const fetchPreferences = async () => {
    if (!session?.user?.id) return;
    
    try {
      const res = await fetch(`/api/preferences/faculty/${session.user.id}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setPreferences(data);
      } else {
        // No preferences found yet - this is okay for new faculty
        setPreferences(null);
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchPreferences();
  }, [session?.user?.id]);

  const getSelectedCourses = () => {
    if (!preferences?.courses) return [];
    return courses.filter(course => 
      preferences.courses.some((prefCourse: any) => 
        prefCourse._id === course._id || prefCourse === course._id
      )
    );
  };

  const selectedCourses = getSelectedCourses();

  return (
    <ProtectedRoute allowedRoles={["faculty"]}>
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Faculty • Course Preferences</h1>
          <LogoutButton />
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-medium text-blue-800 mb-2">Instructions</h2>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• You must select at least <strong>5 course preferences</strong></li>
            <li>• You can be assigned a minimum of 2 and maximum of 3 courses</li>
            <li>• Higher designation faculty get priority in course assignment</li>
            <li>• Earlier submissions get priority if designations are equal</li>
          </ul>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading preferences...</p>
          </div>
        ) : (
          <>
            {/* Current Preferences Status */}
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Current Preferences</h2>
                <button
                  onClick={() => setOpen(true)}
                  className={`px-4 py-2 rounded transition-colors ${
                    selectedCourses.length >= 5 
                      ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {preferences ? 'Update Preferences' : 'Set Preferences'}
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedCourses.length >= 5 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedCourses.length}/5 minimum courses selected
                </div>
                {preferences?.submittedAt && (
                  <div className="text-sm text-gray-600">
                    Last updated: {new Date(preferences.submittedAt).toLocaleDateString()}
                  </div>
                )}
              </div>

              {selectedCourses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No preferences set yet.</p>
                  <p className="text-sm mt-1">Click &quot;Set Preferences&quot; to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedCourses.map((course, index) => (
                    <div key={course._id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                              #{index + 1}
                            </span>
                            <span className="font-medium text-blue-600">{course.code}</span>
                          </div>
                          <h3 className="font-medium mt-1">{course.name}</h3>
                          <p className="text-sm text-gray-600">{course.department}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-gray-500">
                              {course.creditHours} credit hours
                            </span>
                            <span className="text-xs text-gray-500">
                              {course.enrollment} students
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* All Available Courses */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">All Available Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => {
                  const isSelected = selectedCourses.some(sc => sc._id === course._id);
                  return (
                    <div key={course._id} className={`border rounded-lg p-4 ${
                      isSelected ? 'bg-blue-50 border-blue-200' : 'bg-white'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-blue-600">{course.code}</span>
                        {isSelected && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                            Selected
                          </span>
                        )}
                      </div>
                      <h3 className="font-medium mb-1">{course.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{course.department}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{course.creditHours} credit hours</span>
                        <span>{course.enrollment} students</span>
                      </div>
                      {course.multimediaRequired && (
                        <span className="inline-block mt-2 bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                          Multimedia Required
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Preference Modal */}
        <PreferenceModal
          open={open}
          setOpen={setOpen}
          courses={courses}
          currentPreferences={preferences}
          refresh={fetchPreferences}
          facultyId={session?.user?.id}
        />
      </div>
    </ProtectedRoute>
  );
}