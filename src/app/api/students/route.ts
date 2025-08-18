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
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

// ✅ CREATE new student
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, rollNumber, department } = body;

    if (!name || !email || !rollNumber || !department) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const student = await Student.create({ name, email, rollNumber, department });
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error("POST Student Error:", error);
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
}

// ✅ UPDATE student
export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, name, email, rollNumber, department } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    const student = await Student.findByIdAndUpdate(
      id,
      { name, email, rollNumber, department },
      { new: true }
    );

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    console.error("PUT Student Error:", error);
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    );
  }
}

// ✅ DELETE student
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Student deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Student Error:", error);
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  }
}

