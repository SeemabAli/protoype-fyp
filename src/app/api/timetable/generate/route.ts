import { NextResponse } from "next/server";
import Classroom from "@/models/Classroom";
import Preference from "@/models/Preference";
import Course from "@/models/Course";
import Timetable from "@/models/Timetable";

export async function POST() {
  await dbConnect();

  const preferences = await Preference.find({});
  const classrooms = await Classroom.find({});
  const courses = await Course.find({});

  if (!preferences.length || !classrooms.length || !courses.length) {
    return NextResponse.json({ message: "Missing data" }, { status: 400 });
  }

  // Simple allocation logic (placeholder)
  const timetableData = courses.map((course, i) => ({
    courseId: course._id,
    facultyId: preferences[i % preferences.length].facultyId,
    classroomId: classrooms[i % classrooms.length]._id,
    day: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][i % 5],
    timeSlot: `${9 + (i % 5)}:00 - ${10 + (i % 5)}:00`
  }));

  await Timetable.deleteMany({});
  await Timetable.insertMany(timetableData);

  return NextResponse.json({ message: "Timetable generated" });
}
function dbConnect() {
  throw new Error("Function not implemented.");
}

