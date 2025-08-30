// src/app/api/courses/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Course from "@/models/Course";
import { courseSchema } from "@/lib/zodSchemas";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    await connectDB();
    const c = await Course.findById(params.id);
    if (!c) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: c });
  } catch (err) {
    console.error("GET /api/courses/[id] error:", err);
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await connectDB();
    const body = await req.json();
    const parsed = courseSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });

    const updated = await Course.findByIdAndUpdate(params.id, parsed.data, { new: true });
    if (!updated) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("PUT /api/courses/[id] error:", err);
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await connectDB();
    const deleted = await Course.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: deleted });
  } catch (err) {
    console.error("DELETE /api/courses/[id] error:", err);
    return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 });
  }
}
