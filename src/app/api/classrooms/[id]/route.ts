// src/app/api/classrooms/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Classroom from "@/models/Classroom";
import { classroomSchema } from "@/lib/zodSchemas";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const classroom = await Classroom.findById(params.id);
    if (!classroom) {
      return NextResponse.json(
        { success: false, message: "Classroom not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: classroom });
  } catch (error) {
    console.error("GET Classroom Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await req.json();

    const parsed = classroomSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const classroom = await Classroom.findByIdAndUpdate(
      params.id,
      parsed.data,
      { new: true }
    );
    if (!classroom) {
      return NextResponse.json(
        { success: false, message: "Classroom not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: classroom });
  } catch (error) {
    console.error("PUT Classroom Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const classroom = await Classroom.findByIdAndDelete(params.id);
    if (!classroom) {
      return NextResponse.json(
        { success: false, message: "Classroom not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, message: "Classroom deleted" });
  } catch (error) {
    console.error("DELETE Classroom Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
