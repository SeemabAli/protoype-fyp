// src/app/api/meta/timeslots/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Timeslot from "@/models/Timeslot";

export async function GET() {
  await connectDB();
  const timeslots = await Timeslot.find().sort({ day: 1, slotIndex: 1 });
  return NextResponse.json(timeslots);
}
