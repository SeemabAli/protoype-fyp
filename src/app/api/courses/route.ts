// src/app/api/courses/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Course from "@/models/Course";
import { courseSchema } from "@/lib/zodSchemas";

export async function GET() {
  try {
    await connectDB();
    const courses = await Course.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(courses);
  } catch (err) {
    console.error("GET /api/courses error:", err);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const parsed = courseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });
    }

    const exists = await Course.findOne({ code: parsed.data.code });
    if (exists) {
      return NextResponse.json({ success: false, error: "Course code already exists" }, { status: 409 });
    }

    const created = await Course.create(parsed.data);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err) {
    console.error("POST /api/courses error:", err);
    return NextResponse.json({ success: false, error: "Failed to create course" }, { status: 500 });
  }
}
