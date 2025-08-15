/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/me/route.ts
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // return user info you need
  return NextResponse.json({
  id: (session.user as any).id,
  name: session.user?.name,
  email: session.user?.email,
  role: (session.user as any).role,
});

}
