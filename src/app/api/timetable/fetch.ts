/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import Timetable from "@/models/Timetable";
import { connectDB } from "@/lib/mongoose";

export async function GET() {
  await connectDB();

  try {
    const timetable = await Timetable.find({})
      .populate("course", "code title")
      .populate("faculty", "name")
      .populate("classroom", "classroomId building")
      .populate("timeSlot", "day start end")
      .lean();

    return NextResponse.json({ success: true, timetable });
  } catch (err: any) {
    console.error("Error fetching timetable:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
