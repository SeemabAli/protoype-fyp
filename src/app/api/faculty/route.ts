/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Faculty from "@/models/Faculty";

// GET all faculties
export async function GET() {
  try {
    await connectDB();
    const faculties = await Faculty.find();
    return NextResponse.json(faculties, { status: 200 });
  } catch (error) {
    console.error("GET Faculty Error:", error);
    return NextResponse.json({ error: "Failed to fetch faculty" }, { status: 500 });
  }
}

// CREATE new faculty
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, department, designation } = body;

    if (!name || !email || !department || !designation) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const faculty = await Faculty.create({ name, email, department, designation });
    return NextResponse.json(faculty, { status: 201 });
  } catch (error: any) {
    console.error("POST Faculty Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create faculty" }, { status: 500 });
  }
}
