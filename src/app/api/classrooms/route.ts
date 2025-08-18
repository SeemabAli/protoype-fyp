// src/app/api/classrooms/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Classroom from "@/models/Classroom";
import { z } from "zod";

// ✅ Validation schema for Classrooms
const classroomSchema = z.object({
  name: z.string().min(2, "Classroom name is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  location: z.string().min(2, "Location is required"),
});

// ======================= GET =======================
export async function GET() {
  try {
    await connectDB();
    const classrooms = await Classroom.find();
    return NextResponse.json(classrooms, { status: 200 });
  } catch (error) {
    console.error("Error fetching classrooms:", error);
    return NextResponse.json({ error: "Failed to fetch classrooms" }, { status: 500 });
  }
}

// ======================= POST =======================
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const result = classroomSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues.map((err) => err.message).join(", ") },
        { status: 400 }
      );
    }

    const newClassroom = new Classroom(result.data);
    await newClassroom.save();

    return NextResponse.json(newClassroom, { status: 201 });
  } catch (error) {
    console.error("Error creating classroom:", error);
    return NextResponse.json({ error: "Failed to create classroom" }, { status: 500 });
  }
}

// ======================= PUT =======================
export async function PUT(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Classroom ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const result = classroomSchema.partial().safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues.map((err) => err.message).join(", ") },
        { status: 400 }
      );
    }

    const updatedClassroom = await Classroom.findByIdAndUpdate(id, result.data, { new: true });
    if (!updatedClassroom) {
      return NextResponse.json({ error: "Classroom not found" }, { status: 404 });
    }

    return NextResponse.json(updatedClassroom, { status: 200 });
  } catch (error) {
    console.error("Error updating classroom:", error);
    return NextResponse.json({ error: "Failed to update classroom" }, { status: 500 });
  }
}

// ======================= DELETE =======================
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Classroom ID is required" }, { status: 400 });
    }

    const deletedClassroom = await Classroom.findByIdAndDelete(id);
    if (!deletedClassroom) {
      return NextResponse.json({ error: "Classroom not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Classroom deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting classroom:", error);
    return NextResponse.json({ error: "Failed to delete classroom" }, { status: 500 });
  }
}
