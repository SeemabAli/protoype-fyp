// src/app/api/faculty/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Faculty from "@/models/Faculty";
import { facultySchema } from "@/lib/zodSchemas";

// ✅ Get one faculty by ID
export async function GET(_req: Request, context: { params: { id: string } }) {
  try {
    await connectDB();
    const item = await Faculty.findById(context.params.id);
    if (!item) {
      return NextResponse.json(
        { success: false, error: "Faculty not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: item });
  } catch (err) {
    console.error("GET /api/faculty/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch faculty" },
      { status: 500 }
    );
  }
}

// ✅ Update a faculty
export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const parsed = facultySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const updated = await Faculty.findByIdAndUpdate(context.params.id, parsed.data, { new: true });
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Faculty not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("PUT /api/faculty/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update faculty" },
      { status: 500 }
    );
  }
}

// ✅ Delete a faculty
export async function DELETE(_req: Request, context: { params: { id: string } }) {
  try {
    await connectDB();
    const deleted = await Faculty.findByIdAndDelete(context.params.id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Faculty not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: deleted });
  } catch (err) {
    console.error("DELETE /api/faculty/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete faculty" },
      { status: 500 }
    );
  }
}
