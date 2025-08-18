// src/app/api/preferences/faculty/[facultyId]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Preference from "@/models/Preference";

// GET faculty's preferences
export async function GET(
  req: Request,
  { params }: { params: { facultyId: string } }
) {
  try {
    await connectDB();
    const { facultyId } = params;

    const preferences = await Preference.findOne({ facultyId })
      .populate("courses", "code name department creditHours enrollment multimediaRequired");

    if (!preferences) {
      return NextResponse.json({ message: "No preferences found" }, { status: 404 });
    }

    return NextResponse.json(preferences, { status: 200 });
  } catch (error) {
    console.error("Error fetching faculty preferences:", error);
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 });
  }
}