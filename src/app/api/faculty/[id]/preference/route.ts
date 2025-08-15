import { NextResponse } from "next/server";
import Faculty, { coursePreferencesSchema } from "@/models/Faculty";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import mongoose from "mongoose";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "faculty") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();

    // Validate with Zod
    const parsed = coursePreferencesSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid data" },
        { status: 400 }
      );
    }

    const { preferences } = parsed.data;

    // Convert courseId strings to ObjectIds
    const preferencesWithObjectId = preferences.map((pref) => ({
      ...pref,
      courseId: new mongoose.Types.ObjectId(pref.courseId),
    }));

    const updatedFaculty = await Faculty.findByIdAndUpdate(
      params.id,
      {
        preferences: preferencesWithObjectId,
        preferenceSubmittedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedFaculty) {
      return NextResponse.json({ error: "Faculty not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedFaculty });
  } catch (err) {
    console.error("Error saving preferences:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
