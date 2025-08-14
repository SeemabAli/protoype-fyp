/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth/next";
import Faculty from "@/models/Faculty";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const body = await req.json();
  await connectDB();
  const faculty = await Faculty.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(faculty);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  await connectDB();
  await Faculty.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Faculty deleted" });
}
