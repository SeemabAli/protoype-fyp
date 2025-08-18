// src/app/api/courses/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Course from "@/models/Course";
import { z } from "zod";

// ✅ Validation schema for Offered Courses
const courseSchema = z.object({
  code: z.string().min(2, "Course code is required"),
  name: z.string().min(3, "Course name is required"),
  creditHours: z.number().min(1, "Credit hours must be at least 1"),
  department: z.string().min(2, "Department is required"),
});

// ======================= GET =======================
export async function GET() {
  try {
    await connectDB();
    const courses = await Course.find();
    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

// ======================= POST =======================
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const result = courseSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues.map((err) => err.message).join(", ") },
        { status: 400 }
      );
    }

    const newCourse = new Course(result.data);
    await newCourse.save();

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}

// ======================= PUT =======================
export async function PUT(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const result = courseSchema.partial().safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues.map((err) => err.message).join(", ") },
        { status: 400 }
      );
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, result.data, { new: true });
    if (!updatedCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(updatedCourse, { status: 200 });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}

// ======================= DELETE =======================
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    const deletedCourse = await Course.findByIdAndDelete(id);
    if (!deletedCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Course deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
