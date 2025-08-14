import { NextResponse } from "next/server";
import Preference from "@/models/Preference";
import { connectDB } from "@/lib/mongoose";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const facultyId = searchParams.get("facultyId");

  if (!facultyId) {
    return NextResponse.json({ error: "Faculty ID required" }, { status: 400 });
  }

  const prefs = await Preference.find({ facultyId });
  return NextResponse.json(prefs);
}