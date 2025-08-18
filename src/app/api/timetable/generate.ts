/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Timetable from "@/models/Timetable";
import Course, { ICourse } from "@/models/Course";
import Faculty, { IFaculty } from "@/models/Faculty";
import Timeslot, { ITimeslot } from "@/models/Timeslot";
import Classroom, { IClassroom } from "@/models/Classroom";
import { connectDB } from "@/lib/mongoose";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export async function POST(req: Request) {
  await connectDB();

  try {
    // Clear previous timetable (optional)
    await Timetable.deleteMany({});

    // Fetch all data as plain objects
    const courses = (await Course.find({}).lean<ICourse>()) as unknown as ICourse[];
    const facultyList = (await Faculty.find({}).lean<IFaculty>()) as unknown as IFaculty[];
    const timeslots = (await Timeslot.find({}).lean<ITimeslot>()) as unknown as ITimeslot[];
    const classrooms = (await Classroom.find({}).lean<IClassroom>()) as unknown as IClassroom[];

    const timetableEntries: any[] = [];

    for (const course of courses) {
      // Filter preferred faculties safely
      const preferredFaculties: IFaculty[] =
  course.preferredFacultyIds && course.preferredFacultyIds.length
    ? facultyList.filter(f =>
        course.preferredFacultyIds!.includes((f._id as mongoose.Types.ObjectId).toString())
      )
    : facultyList;

      let assigned = false;

      for (const faculty of preferredFaculties) {
        for (const timeslot of timeslots) {
          for (const classroom of classrooms) {
            // Conflict check
            const conflict = await Timetable.findOne({
              $or: [
                { faculty: faculty._id, timeSlot: timeslot._id, day: timeslot.day },
                { classroom: classroom._id, timeSlot: timeslot._id, day: timeslot.day },
              ],
            });

            if (!conflict) {
              const entry = await Timetable.create({
                course: course._id,
                faculty: faculty._id,
                classroom: classroom._id,
                timeSlot: timeslot._id,
                day: timeslot.day || DAYS[Math.floor(Math.random() * DAYS.length)],
                studentBatch: course.studentBatch || "Batch A",
                semester: "Fall 2025",
              });

              timetableEntries.push(entry);
              assigned = true;
              break;
            }
          }
          if (assigned) break;
        }
        if (assigned) break;
      }

      if (!assigned) {
        console.warn(`Course ${course.title} could not be scheduled`);
      }
    }

    return NextResponse.json({ success: true, timetable: timetableEntries });
  } catch (err: any) {
    console.error("Timetable generation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
