// src/app/api/faculty/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Faculty from "@/models/Faculty";

// ✅ GET all faculty
export async function GET() {
  try {
    await connectDB();
    const faculties = await Faculty.find();
    return NextResponse.json(faculties, { status: 200 });
  } catch (error) {
    console.error("GET Faculty Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch faculty" },
      { status: 500 }
    );
  }
}

// ✅ CREATE new faculty
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, department } = body;

    if (!name || !email || !department) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const faculty = await Faculty.create({ name, email, department });
    return NextResponse.json(faculty, { status: 201 });
  } catch (error) {
    console.error("POST Faculty Error:", error);
    return NextResponse.json(
      { error: "Failed to create faculty" },
      { status: 500 }
    );
  }
}

// ✅ UPDATE faculty
export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, name, email, department } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Faculty ID is required" },
        { status: 400 }
      );
    }

    const faculty = await Faculty.findByIdAndUpdate(
      id,
      { name, email, department },
      { new: true }
    );

    if (!faculty) {
      return NextResponse.json(
        { error: "Faculty not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(faculty, { status: 200 });
  } catch (error) {
    console.error("PUT Faculty Error:", error);
    return NextResponse.json(
      { error: "Failed to update faculty" },
      { status: 500 }
    );
  }
}

// ✅ DELETE faculty
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Faculty ID is required" },
        { status: 400 }
      );
    }

    const faculty = await Faculty.findByIdAndDelete(id);
    if (!faculty) {
      return NextResponse.json(
        { error: "Faculty not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Faculty deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Faculty Error:", error);
    return NextResponse.json(
      { error: "Failed to delete faculty" },
      { status: 500 }
    );
  }
}
