import { NextResponse } from "next/server";
import Course from "@/models/Course";
import { connectDB } from "@/lib/mongoose";

export async function GET() {
  await connectDB();
  const courses = await Course.find().sort({ createdAt: -1 });
  return NextResponse.json(courses);
}

export async function POST(req: Request) {
  const body = await req.json();
  await connectDB();
  const course = await Course.create(body);
  return NextResponse.json(course);
}
