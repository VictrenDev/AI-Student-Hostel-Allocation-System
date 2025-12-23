// app/api/set-questionnaire-cookie/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/status", request.url));

  // Make sure path is "/" so it's accessible everywhere
  response.cookies.set("questionnaire_submitted", "true", {
    httpOnly: false, // Must be false for client-side reading
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    path: "/", // ← IMPORTANT: This makes cookie available on all paths
  });

  return response;
}
