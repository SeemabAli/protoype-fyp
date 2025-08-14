import { NextResponse } from "next/server";
import Course from "@/models/Course";
import { connectDB } from "@/lib/mongoose";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  await connectDB();
  const course = await Course.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(course);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  await Course.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}
