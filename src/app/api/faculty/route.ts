// src/app/api/faculty/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Faculty from "@/models/Faculty";
import { facultySchema } from "@/lib/zodSchemas";

export async function GET() {
  try {
    await connectDB();
    const list = await Faculty.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(list); // array directly
  } catch (err) {
    console.error("GET /api/faculty error:", err);
    return NextResponse.json({ error: "Failed to fetch faculties" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const parsed = facultySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });
    }

    const exists = await Faculty.findOne({ facultyId: parsed.data.facultyId });
    if (exists) {
      return NextResponse.json({ success: false, error: "Faculty ID already exists" }, { status: 409 });
    }

    const created = await Faculty.create({ ...parsed.data, submittedAt: new Date() });
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err) {
    console.error("POST /api/faculty error:", err);
    return NextResponse.json({ success: false, error: "Failed to create faculty" }, { status: 500 });
  }
}
