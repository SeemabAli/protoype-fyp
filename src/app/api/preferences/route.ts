// src/app/api/preferences/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Preference from "@/models/Preference";
import Faculty from "@/models/Faculty";
import Course from "@/models/Course";
import { z } from "zod";

// ✅ Validation schema for Preferences
const preferenceSchema = z.object({
  facultyId: z.string().min(1, "Faculty ID is required"),
  courses: z.array(z.string()).min(1, "At least one course must be selected"),
});

// ======================= GET =======================
export async function GET() {
  try {
    await connectDB();
    const preferences = await Preference.find()
      .populate("facultyId", "name email")
      .populate("courses", "name code");
    return NextResponse.json(preferences, { status: 200 });
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 });
  }
}

// ======================= POST =======================
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const result = preferenceSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues.map((err) => err.message).join(", ") },
        { status: 400 }
      );
    }

    const { facultyId, courses } = result.data;

    // Ensure faculty exists
    const faculty = await Faculty.findById(facultyId);
    if (!faculty) {
      return NextResponse.json({ error: "Faculty not found" }, { status: 404 });
    }

    // Ensure all courses exist
    const courseCheck = await Course.find({ _id: { $in: courses } });
    if (courseCheck.length !== courses.length) {
      return NextResponse.json({ error: "Some courses not found" }, { status: 400 });
    }

    const newPreference = new Preference({
      facultyId,
      courses,
    });

    await newPreference.save();

    return NextResponse.json(newPreference, { status: 201 });
  } catch (error) {
    console.error("Error creating preference:", error);
    return NextResponse.json({ error: "Failed to create preference" }, { status: 500 });
  }
}

// ======================= PUT =======================
export async function PUT(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Preference ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const result = preferenceSchema.partial().safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues.map((err) => err.message).join(", ") },
        { status: 400 }
      );
    }

    const updatedPreference = await Preference.findByIdAndUpdate(id, result.data, {
      new: true,
    })
      .populate("facultyId", "name email")
      .populate("courses", "name code");

    if (!updatedPreference) {
      return NextResponse.json({ error: "Preference not found" }, { status: 404 });
    }

    return NextResponse.json(updatedPreference, { status: 200 });
  } catch (error) {
    console.error("Error updating preference:", error);
    return NextResponse.json({ error: "Failed to update preference" }, { status: 500 });
  }
}

// ======================= DELETE =======================
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Preference ID is required" }, { status: 400 });
    }

    const deletedPreference = await Preference.findByIdAndDelete(id);
    if (!deletedPreference) {
      return NextResponse.json({ error: "Preference not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Preference deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting preference:", error);
    return NextResponse.json({ error: "Failed to delete preference" }, { status: 500 });
  }
}
