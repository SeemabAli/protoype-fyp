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

    // Clear old schedule
    await Timetable.deleteMany({});

    const faculties = await Faculty.find();
    const courses = await Course.find();
    const classrooms = await Classroom.find();

    // 1️⃣ Build preference map
    const courseRequests: Record<string, any[]> = {};
    type FacultyType = {
      _id: string;
      designation: "Professor" | "AssociateProfessor" | "AssistantProfessor" | "Lecturer";
      preferences?: any[];
      submittedAt: string;
    };

    faculties.forEach((f: FacultyType) => {
      (f.preferences || []).forEach((pref: any) => {
        if (!courseRequests[pref.courseId]) courseRequests[pref.courseId] = [];
        courseRequests[pref.courseId].push(f);
      });
    });

    const scheduled: any[] = [];

    // 2️⃣ Assign courses to faculty
    for (const course of courses) {
      const requestingFaculty: FacultyType[] = courseRequests[course.courseId] || [];

      if (requestingFaculty.length === 0) continue; // no faculty requested

      const priority: { [key in FacultyType["designation"]]: number } = { Professor: 4, AssociateProfessor: 3, AssistantProfessor: 2, Lecturer: 1 };
      requestingFaculty.sort((a: FacultyType, b: FacultyType) => {
        if (priority[b.designation] !== priority[a.designation]) {
          return priority[b.designation] - priority[a.designation];
        }
        return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      });
      const chosenFaculty = requestingFaculty[0];

      // 3️⃣ Find suitable classroom
      const room = classrooms.find(
        (r) =>
          r.capacity >= course.enrollment &&
          (!course.multimediaRequired || r.multimediaAvailable)
      );
      if (!room) continue; // no room available

      // 4️⃣ Pick a time slot
      const day = "Monday"; // For prototype: just assign first available
      const slot = "09:30am – 11:00am";

      // 5️⃣ Save to timetable
      const entry = await Timetable.create({
        course: course._id,
        faculty: chosenFaculty._id,
        classroom: room._id,
        day,
        slot,
      });

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
