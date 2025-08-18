// src/app/api/coordinators/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Coordinator from "@/models/Coordinator";
import { z } from "zod";

// ✅ Validation schema (can be moved to zodSchemas.ts later)
const coordinatorSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  department: z.string().min(2, "Department is required"),
});

// ======================= GET =======================
export async function GET() {
  try {
    await connectDB();
    const coordinators = await Coordinator.find();
    return NextResponse.json(coordinators, { status: 200 });
  } catch (error) {
    console.error("Error fetching coordinators:", error);
    return NextResponse.json({ error: "Failed to fetch coordinators" }, { status: 500 });
  }
}

// ======================= POST =======================
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const result = coordinatorSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues.map((err) => err.message).join(", ") },
        { status: 400 }
      );
    }

    const newCoordinator = new Coordinator(result.data);
    await newCoordinator.save();

    return NextResponse.json(newCoordinator, { status: 201 });
  } catch (error) {
    console.error("Error creating coordinator:", error);
    return NextResponse.json({ error: "Failed to create coordinator" }, { status: 500 });
  }
}

// ======================= PUT =======================
export async function PUT(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Coordinator ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const result = coordinatorSchema.partial().safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues.map((err) => err.message).join(", ") },
        { status: 400 }
      );
    }

    const updatedCoordinator = await Coordinator.findByIdAndUpdate(id, result.data, { new: true });
    if (!updatedCoordinator) {
      return NextResponse.json({ error: "Coordinator not found" }, { status: 404 });
    }

    return NextResponse.json(updatedCoordinator, { status: 200 });
  } catch (error) {
    console.error("Error updating coordinator:", error);
    return NextResponse.json({ error: "Failed to update coordinator" }, { status: 500 });
  }
}

// ======================= DELETE =======================
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Coordinator ID is required" }, { status: 400 });
    }

    const deletedCoordinator = await Coordinator.findByIdAndDelete(id);
    if (!deletedCoordinator) {
      return NextResponse.json({ error: "Coordinator not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Coordinator deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting coordinator:", error);
    return NextResponse.json({ error: "Failed to delete coordinator" }, { status: 500 });
  }
}
