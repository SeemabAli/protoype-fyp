/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Coordinator from "@/models/Coordinator";
import { coordinatorSchema } from "@/lib/zodSchemas";

// ======================= GET =======================
export async function GET() {
  try {
    await connectDB();
    const coordinators = await Coordinator.find();
    return NextResponse.json(coordinators, { status: 200 });
  } catch (error) {
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
        { error: result.error.issues.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    const newCoordinator = new Coordinator(result.data);
    await newCoordinator.save();

    return NextResponse.json(newCoordinator, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create coordinator" }, { status: 500 });
  }
}
