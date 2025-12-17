// app/api/set-student-cookie/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { studentUuid } = await req.json();

  if (!studentUuid) {
    return NextResponse.json(
      { success: false, error: "Missing UUID" },
      { status: 400 },
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: "student_uuid",
    value: studentUuid,
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
