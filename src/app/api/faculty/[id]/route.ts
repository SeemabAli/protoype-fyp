/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Faculty from "@/models/Faculty";

interface Params {
  params: { id: string };
}

// GET one faculty
export async function GET(req: Request, { params }: Params) {
  try {
    await connectDB();
    const faculty = await Faculty.findById(params.id);
    if (!faculty) return NextResponse.json({ error: "Faculty not found" }, { status: 404 });
    return NextResponse.json(faculty, { status: 200 });
  } catch (error: any) {
    console.error("GET Faculty Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch faculty" }, { status: 500 });
  }
}

// UPDATE faculty
export async function PUT(req: Request, { params }: Params) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, department, designation } = body;

    const faculty = await Faculty.findByIdAndUpdate(
      params.id,
      { name, email, department, designation },
      { new: true }
    );

    if (!faculty) return NextResponse.json({ error: "Faculty not found" }, { status: 404 });

    return NextResponse.json(faculty, { status: 200 });
  } catch (error: any) {
    console.error("PUT Faculty Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update faculty" }, { status: 500 });
  }
}

// DELETE faculty
export async function DELETE(req: Request, { params }: Params) {
  try {
    await connectDB();
    const faculty = await Faculty.findByIdAndDelete(params.id);

    if (!faculty) return NextResponse.json({ error: "Faculty not found" }, { status: 404 });

    return NextResponse.json({ message: "Faculty deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE Faculty Error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete faculty" }, { status: 500 });
  }
}
