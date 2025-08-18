// src/app/api/timeslots/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Timeslot from "@/models/Timeslot";
import { z } from "zod";

// ✅ Validation schema for Timeslot
const timeslotSchema = z.object({
  day: z.string().min(1, "Day is required"), // Example: "Monday"
  startTime: z.string().min(1, "Start time is required"), // Example: "09:00"
  endTime: z.string().min(1, "End time is required"),     // Example: "10:30"
});

// ======================= GET =======================
export async function GET() {
  try {
    await connectDB();
    const timeslots = await Timeslot.find();
    return NextResponse.json(timeslots, { status: 200 });
  } catch (error) {
    console.error("Error fetching timeslots:", error);
    return NextResponse.json({ error: "Failed to fetch timeslots" }, { status: 500 });
  }
}

// ======================= POST =======================
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const result = timeslotSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues.map((err) => err.message).join(", ") },
        { status: 400 }
      );
    }

    const { day, startTime, endTime } = result.data;

    const newTimeslot = new Timeslot({
      day,
      startTime,
      endTime,
    });

    await newTimeslot.save();

    return NextResponse.json(newTimeslot, { status: 201 });
  } catch (error) {
    console.error("Error creating timeslot:", error);
    return NextResponse.json({ error: "Failed to create timeslot" }, { status: 500 });
  }
}

// ======================= PUT =======================
export async function PUT(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Timeslot ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const result = timeslotSchema.partial().safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues.map((err) => err.message).join(", ") },
        { status: 400 }
      );
    }

    const updatedTimeslot = await Timeslot.findByIdAndUpdate(id, result.data, {
      new: true,
    });

    if (!updatedTimeslot) {
      return NextResponse.json({ error: "Timeslot not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTimeslot, { status: 200 });
  } catch (error) {
    console.error("Error updating timeslot:", error);
    return NextResponse.json({ error: "Failed to update timeslot" }, { status: 500 });
  }
}

// ======================= DELETE =======================
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Timeslot ID is required" }, { status: 400 });
    }

    const deletedTimeslot = await Timeslot.findByIdAndDelete(id);
    if (!deletedTimeslot) {
      return NextResponse.json({ error: "Timeslot not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Timeslot deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting timeslot:", error);
    return NextResponse.json({ error: "Failed to delete timeslot" }, { status: 500 });
  }
}
