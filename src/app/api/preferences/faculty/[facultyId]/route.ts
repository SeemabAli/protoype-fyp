/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Preference from "@/models/Preference";
import Faculty from "@/models/Faculty";
import Course from "@/models/Course";
import { z } from "zod";

// Validation schema
const preferenceSchema = z.object({
  courses: z.array(z.string()).min(1, "At least one course must be selected"),
});

// ======================= GET =======================
export async function GET(req: Request, context: { params: { facultyId: string } }) {
  await connectDB();
  try {
    const { facultyId } = context.params;

    const faculty = await Faculty.findById(facultyId);
    if (!faculty) return NextResponse.json({ error: "Faculty not found" }, { status: 404 });

    const pref = await Preference.findOne({ facultyId })
      .populate("courses", "name code department creditHours enrollment multimediaRequired")
      .lean();

    return NextResponse.json({
      facultyId,
      courses: pref?.courses || [],
      submittedAt: pref?.submittedAt || null,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ======================= POST =======================
export async function POST(req: Request, context: { params: { facultyId: string } }) {
  await connectDB();
  try {
    const { facultyId } = context.params;

    const body = await req.json();
    const result = preferenceSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues.map(i => i.message).join(", ") },
        { status: 400 }
      );
    }

    const { courses } = result.data;

    const faculty = await Faculty.findById(facultyId);
    if (!faculty) return NextResponse.json({ error: "Faculty not found" }, { status: 404 });

    const validCourses = await Course.find({ _id: { $in: courses } });
    if (validCourses.length !== courses.length) {
      return NextResponse.json({ error: "Some courses not found" }, { status: 400 });
    }

    const updatedPref = await Preference.findOneAndUpdate(
      { facultyId },
      { facultyId, courses, submittedAt: new Date() },
      { new: true, upsert: true }
    ).populate("courses", "name code department creditHours enrollment multimediaRequired");

    return NextResponse.json({
      facultyId,
      courses: updatedPref?.courses || [],
      submittedAt: updatedPref?.submittedAt || null,
    }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
