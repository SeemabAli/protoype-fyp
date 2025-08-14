import { NextResponse } from "next/server";
import Classroom from "@/models/Classroom";
import { connectDB } from "@/lib/mongoose";

export async function GET() {
  await connectDB();
  const classrooms = await Classroom.find().sort({ createdAt: -1 });
  return NextResponse.json(classrooms);
}

export async function POST(req: Request) {
  const body = await req.json();
  await connectDB();
  const classroom = await Classroom.create(body);
  return NextResponse.json(classroom);
}
