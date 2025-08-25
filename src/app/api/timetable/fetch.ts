/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Timetable from "@/models/Timetable";

export async function GET() {
  try {
    await connectDB();

    const entries = await Timetable.find({})
      .populate("course")
      .populate("faculty")
      .populate("classroom")
      .populate("timeSlot")
      .lean();

    return NextResponse.json({ timetable: entries }, { status: 200 });
  } catch (err: any) {
    console.error("GET timetable fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch timetable" }, { status: 500 });
  }
}
