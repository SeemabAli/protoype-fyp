/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Coordinator from "@/models/Coordinator";
import { coordinatorSchema } from "@/lib/zodSchemas";

// ======================= GET =======================
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const coordinator = await Coordinator.findById(params.id);
    if (!coordinator) {
      return NextResponse.json({ error: "Coordinator not found" }, { status: 404 });
    }
    return NextResponse.json(coordinator, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch coordinator" }, { status: 500 });
  }
}

// ======================= PUT =======================
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const result = coordinatorSchema.partial().safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    const updatedCoordinator = await Coordinator.findByIdAndUpdate(
      params.id,
      result.data,
      { new: true }
    );
    if (!updatedCoordinator) {
      return NextResponse.json({ error: "Coordinator not found" }, { status: 404 });
    }

    return NextResponse.json(updatedCoordinator, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update coordinator" }, { status: 500 });
  }
}

// ======================= DELETE =======================
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const deleted = await Coordinator.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ error: "Coordinator not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Coordinator deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete coordinator" }, { status: 500 });
  }
}
