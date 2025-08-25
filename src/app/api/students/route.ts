// src/app/api/students/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Student from "@/models/Student";

// ✅ GET all students
export async function GET() {
  try {
    await connectDB();
    const students = await Student.find();
    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error("GET Student Error:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

// ✅ CREATE student
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, registrationNumber, department, semester, section } = body;

    if (!name || !email || !registrationNumber || !department || !semester) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const student = await Student.create({ name, email, registrationNumber, department, semester, section });
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error("POST Student Error:", error);
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
  }
}
