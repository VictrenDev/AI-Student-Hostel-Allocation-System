import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out" });

  // Delete the cookie by setting it with maxAge 0
  response.cookies.set({
    name: "student_uuid",
    value: "",
    path: "/",
    httpOnly: true,
    maxAge: 0,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
