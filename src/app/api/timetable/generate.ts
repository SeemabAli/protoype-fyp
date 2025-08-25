/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Timetable from "@/models/Timetable";
import Course from "@/models/Course";
import Faculty from "@/models/Faculty";
import Timeslot from "@/models/Timeslot";
import Classroom from "@/models/Classroom";
import { connectDB } from "@/lib/mongoose";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export async function POST(req: Request) {
  await connectDB();

  try {
    // Clear previous timetable (optional, can be removed if needed)
    await Timetable.deleteMany({});

    // Fetch all data as plain objects
    const courses = await Course.find({}).lean();
    const facultyList = await Faculty.find({}).lean();
    const timeslots = await Timeslot.find({}).lean();
    const classrooms = await Classroom.find({}).lean();

    for (const course of courses) {
      // Normalize preferred faculty ids to strings
      const preferredIds = Array.isArray(course.preferredFacultyIds)
        ? course.preferredFacultyIds.map((id: any) => String(id))
        : [];

      const preferredFaculties = preferredIds.length
        ? facultyList.filter((f: any) => preferredIds.includes(String(f._id)))
        : facultyList;

      let assigned = false;

      for (const faculty of preferredFaculties) {
        for (const timeslot of timeslots) {
          for (const classroom of classrooms) {
            // Check conflicts: faculty or classroom at same timeslot & day
            const conflict = await Timetable.findOne({
              $or: [
                { faculty: faculty._id, timeSlot: timeslot._id, day: timeslot.day },
                { classroom: classroom._id, timeSlot: timeslot._id, day: timeslot.day },
              ],
            });

            if (!conflict) {
              await Timetable.create({
                course: course._id,
                faculty: faculty._id,
                classroom: classroom._id,
                timeSlot: timeslot._id,
                day: timeslot.day ?? DAYS[Math.floor(Math.random() * DAYS.length)],
                studentBatch: course.studentBatch ?? "Batch A",
                semester: "Fall 2025", // hardcoded because Course has no semester field
              });

              assigned = true;
              break;
            }
          }
          if (assigned) break;
        }
        if (assigned) break;
      }

      if (!assigned) {
        console.warn(`Course ${course.title ?? course.code} could not be scheduled`);
      }
    }

    // Return populated entries so frontend can display details
    const populated = await Timetable.find({})
      .populate("course")
      .populate("faculty")
      .populate("classroom")
      .populate("timeSlot")
      .lean();

    return NextResponse.json({ success: true, timetable: populated }, { status: 200 });
  } catch (err: any) {
    console.error("Timetable generation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
