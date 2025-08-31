import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Timetable from "@/models/Timetable";

export async function GET() {
  try {
    await connectDB();

    const schedule = await Timetable.find()
      .populate([
        { path: "course", select: "code title enrollment multimediaRequired studentBatch" },
        { path: "faculty", select: "facultyId name department designation" },
        { path: "classroom", select: "classroomId building capacity multimediaAvailable" }
      ])
      .sort({ day: 1, slot: 1 })
      .lean();

    return NextResponse.json({ success: true, data: schedule });
  } catch (err) {
    console.error("GET /api/schedule error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch schedule" },
      { status: 500 }
    );
  }
}
