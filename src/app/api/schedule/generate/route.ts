/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Timetable from "@/models/Timetable";
import Faculty from "@/models/Faculty";
import Course from "@/models/Course";
import Classroom from "@/models/Classroom";

export async function POST() {
  try {
    await connectDB();
    await Timetable.deleteMany({});

    const faculties = await Faculty.find().lean();
    const courses = await Course.find().lean();
    const classrooms = await Classroom.find().lean();

    // Map courseCode -> course document
    const courseMap: Record<string, any> = {};
    courses.forEach(c => { courseMap[c.code] = c; });

    // Build preference map: courseCode -> faculty[]
    const courseRequests: Record<string, any[]> = {};
    faculties.forEach(f => {
      (f.coursePreferences || []).forEach((code: string) => {
        if (courseMap[code]) {
          if (!courseRequests[code]) courseRequests[code] = [];
          courseRequests[code].push(f);
        }
      });
    });

    const priority: Record<string, number> = {
      Professor: 4,
      "Associate Professor": 3,
      "Assistant Professor": 2,
      Lecturer: 1,
    };

    const scheduled: any[] = [];
    const defaultSlots = [
      "08:00am – 09:30am",
      "09:30am – 11:00am",
      "11:00am – 12:30pm",
      "01:30pm – 03:00pm",
      "03:00pm – 04:30pm",
    ];
    const defaultDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    for (const code of Object.keys(courseRequests)) {
      const course = courseMap[code];
      if (!course) continue;

      let requestingFaculty = courseRequests[code];
      if (requestingFaculty.length === 0) continue;

      // Sort by designation then submission time
      requestingFaculty.sort((a: any, b: any) => {
        if (priority[b.designation] !== priority[a.designation]) {
          return priority[b.designation] - priority[a.designation];
        }
        return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      });

      const chosenFaculty = requestingFaculty[0];

      // Pick classroom
      const room = classrooms.find(
        r =>
          r.capacity >= course.enrollment &&
          (!course.multimediaRequired || r.multimediaAvailable)
      );
      if (!room) continue;

      // Pick time slot
      let chosenDay = defaultDays[Math.floor(Math.random() * defaultDays.length)];
      let chosenSlot = defaultSlots[Math.floor(Math.random() * defaultSlots.length)];

      if (chosenFaculty.timePreferences?.length) {
        const first = chosenFaculty.timePreferences[0];
        // Expect "Monday 09:30am – 11:00am" or similar format
        const parts = first.split(" ");
        if (parts.length >= 2) {
          chosenDay = parts[0];
          chosenSlot = parts.slice(1).join(" ");
        }
      }

      // Save to timetable
      const entry = await Timetable.create({
        course: course._id,
        faculty: chosenFaculty._id,
        classroom: room._id,
        day: chosenDay,
        slot: chosenSlot,
      });

      await entry.populate("course faculty classroom");
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
