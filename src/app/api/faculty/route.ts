// src/app/api/faculty/route.ts
import { NextResponse } from "next/server";
import Faculty from "@/models/Faculty";
import { connectDB } from "@/lib/mongoose";

export async function GET() {
  await connectDB();
  const faculty = await Faculty.find();
  return NextResponse.json(faculty);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();

    const newFaculty = await Faculty.create(body);
    return NextResponse.json(newFaculty, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating faculty", error },
      { status: 500 }
    );
  }
}
