/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/api/classrooms/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Classroom from "@/models/Classroom";
import { z } from "zod";

const updateSchema = z.object({
  classroomId: z.string().optional(),
  building: z.string().optional(),
  capacity: z.number().min(1).optional(),
  multimedia: z.boolean().optional(),
});

// GET one
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const classroom = await Classroom.findById(params.id);
    if (!classroom) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(classroom, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch classroom" }, { status: 500 });
  }
}

// PUT
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((i) => i.message).join(", ") },
        { status: 400 }
      );
    }
    const updated = await Classroom.findByIdAndUpdate(params.id, parsed.data, { new: true });
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update classroom" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const deleted = await Classroom.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete classroom" }, { status: 500 });
  }
}
