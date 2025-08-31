/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Timetable from "@/models/Timetable";
import Faculty from "@/models/Faculty";
import Course from "@/models/Course";
import Classroom from "@/models/Classroom";
import mongoose from "mongoose";

export async function POST() {
  try {
    await connectDB();
    await Timetable.deleteMany({}); // clear old schedule

    const faculties = await Faculty.find().lean();
    const courses = await Course.find().lean();
    const classrooms = await Classroom.find().lean();

    const defaultDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
    ];
    const defaultSlots = [
      "08:00am – 09:30am",
      "09:30am – 11:00am",
      "11:00am – 12:30pm",
      "01:30pm – 03:00pm",
      "03:00pm – 04:30pm",
    ];

    // Track busy slots
    const facultyBusy: Record<string, Set<string>> = {};
    const classroomBusy: Record<string, Set<string>> = {};
    const scheduled: any[] = [];

    // Step 1: Build course preference mapping
    const courseRequests: Record<string, any[]> = {};

    for (const faculty of faculties) {
      for (const courseCode of faculty.coursePreferences || []) {
        if (!courseRequests[courseCode]) {
          courseRequests[courseCode] = [];
        }
        courseRequests[courseCode].push({
          faculty,
          timestamp: faculty.createdAt || new Date(),
        });
      }
    }

    // Step 2: Sort requests by priority (designation first, then timestamp)
    const designationPriority: Record<string, number> = {
      Professor: 4,
      "Associate Professor": 3,
      "Assistant Professor": 2,
      Lecturer: 1,
    };

    for (const courseCode in courseRequests) {
      courseRequests[courseCode].sort((a, b) => {
        const aPriority = designationPriority[a.faculty.designation] || 0;
        const bPriority = designationPriority[b.faculty.designation] || 0;

        if (aPriority !== bPriority) {
          return bPriority - aPriority; // Higher designation first
        }

        // If same designation, earlier timestamp first
        return (
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      });
    }

    // Step 3: Create list of course assignments to schedule
    const assignedCourses = new Set<string>();
    const coursesToSchedule: any[] = [];

    for (const courseCode in courseRequests) {
      if (assignedCourses.has(courseCode)) continue;

      const course = courses.find((c) => c.code === courseCode);
      if (!course) continue;

      // Get the highest priority faculty for this course
      const topRequest = courseRequests[courseCode][0];
      const faculty = topRequest.faculty;

      coursesToSchedule.push({
        course,
        faculty,
        courseCode,
      });

      assignedCourses.add(courseCode);
    }

    // Step 4: Shuffle courses to avoid clustering on Monday
    // Sort by faculty designation to prioritize higher-ranked faculty slots
    coursesToSchedule.sort((a, b) => {
      const aPriority = designationPriority[a.faculty.designation] || 0;
      const bPriority = designationPriority[b.faculty.designation] || 0;
      return bPriority - aPriority;
    });

    // Step 5: Schedule each course assignment
    for (const assignment of coursesToSchedule) {
      const { course, faculty } = assignment;

      // Find suitable classroom
      const room = classrooms.find(
        (r) =>
          r.capacity >= course.enrollment &&
          (!course.multimediaRequired || r.multimediaAvailable)
      );

      if (!room) {
        console.warn(`No suitable classroom for course ${course.code}`);
        continue;
      }

      const facultyId: string = String(faculty._id);
      const roomId: string = String(room._id);

      // Get faculty's available day-slot combinations
      const facultyAvailableSlots: Array<{ day: string; slot: string }> = [];

      if (faculty.timePreferences && Array.isArray(faculty.timePreferences)) {
        for (const pref of faculty.timePreferences) {
          if (pref.day && pref.slots && Array.isArray(pref.slots)) {
            for (const slot of pref.slots) {
              facultyAvailableSlots.push({ day: pref.day, slot });
            }
          }
        }
      }

      // If no specific preferences, make available across all days
      if (facultyAvailableSlots.length === 0) {
        for (const day of defaultDays) {
          for (const slot of defaultSlots) {
            facultyAvailableSlots.push({ day, slot });
          }
        }
      }

      // Sort available slots to distribute across different days
      // Prioritize days with fewer existing assignments for this faculty
      facultyAvailableSlots.sort((a, b) => {
        const aCount = scheduled.filter(
          (s) => String(s.faculty._id) === facultyId && s.day === a.day
        ).length;
        const bCount = scheduled.filter(
          (s) => String(s.faculty._id) === facultyId && s.day === b.day
        ).length;
        return aCount - bCount;
      });

      // Find first available slot
      let chosenDay: string | null = null;
      let chosenSlot: string | null = null;

      for (const { day, slot } of facultyAvailableSlots) {
        const facultyKey = `${day}-${slot}`;
        const roomKey = `${day}-${slot}`;

        if (
          !facultyBusy[facultyId]?.has(facultyKey) &&
          !classroomBusy[roomId]?.has(roomKey)
        ) {
          chosenDay = day;
          chosenSlot = slot;

          // Mark as busy
          if (!facultyBusy[facultyId]) facultyBusy[facultyId] = new Set();
          if (!classroomBusy[roomId]) classroomBusy[roomId] = new Set();

          facultyBusy[facultyId].add(facultyKey);
          classroomBusy[roomId].add(roomKey);
          break;
        }
      }

      if (!chosenDay || !chosenSlot) {
        console.warn(`No available time slot for course ${course.code}`);
        continue;
      }

      // Create timetable entry
      const entry = await Timetable.create({
        course: new mongoose.Types.ObjectId(String(course._id)),
        faculty: new mongoose.Types.ObjectId(String(faculty._id)),
        classroom: new mongoose.Types.ObjectId(String(room._id)),
        day: chosenDay,
        slot: chosenSlot,
      });

      await entry.populate([
        { path: "course", select: "code title" },
        { path: "faculty", select: "facultyId name" },
        { path: "classroom", select: "classroomId building" },
      ]);

      scheduled.push(entry);
    }

    return NextResponse.json({
      success: true,
      message: "Schedule generated successfully",
      data: scheduled,
    });
  } catch (err) {
    console.error("POST /api/schedule/generate error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to generate schedule" },
      { status: 500 }
    );
  }
}
