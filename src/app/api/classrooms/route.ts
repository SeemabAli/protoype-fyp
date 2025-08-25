/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/api/classrooms/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Classroom from "@/models/Classroom";
import { z } from "zod";

const classroomSchema = z.object({
  classroomId: z.string().min(2, "Classroom ID is required"),
  building: z.string().min(2, "Building is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  multimedia: z.boolean(),
});

// ========== GET All ==========
export async function GET() {
  try {
    await connectDB();
    const classrooms = await Classroom.find();
    return NextResponse.json(classrooms, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch classrooms" }, { status: 500 });
  }
}

// ========== POST ==========
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const parsed = classroomSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((i) => i.message).join(", ") },
        { status: 400 }
      );
    }

    const classroom = new Classroom(parsed.data);
    await classroom.save();
    return NextResponse.json(classroom, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create classroom" }, { status: 500 });
  }
}
