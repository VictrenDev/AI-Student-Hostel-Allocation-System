import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out" });

  // Delete the cookie by setting it with maxAge 0
  // Delete student_uuid (httpOnly cookie)
  response.cookies.delete("student_uuid");
  response.cookies.delete("questionnaire_submitted");

  return response;
}
