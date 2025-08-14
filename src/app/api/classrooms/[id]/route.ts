import { NextResponse } from "next/server";
import Classroom from "@/models/Classroom";
import { connectDB } from "@/lib/mongoose";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  await connectDB();
  const classroom = await Classroom.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(classroom);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  await Classroom.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}
