// src/app/api/students/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Student from "@/models/Student";

// ✅ UPDATE student
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, registrationNumber, department, semester, section } = body;

    const student = await Student.findByIdAndUpdate(
      params.id,
      { name, email, registrationNumber, department, semester, section },
      { new: true }
    );

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    console.error("PUT Student Error:", error);
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
  }
}

// ✅ DELETE student
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const student = await Student.findByIdAndDelete(params.id);

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Student deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Student Error:", error);
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
  }
}
