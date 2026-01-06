// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const studentUuid = req.cookies.get("student_uuid")?.value;
  const hasSubmitted =
    req.cookies.get("questionnaire_submitted")?.value === "true";

  console.log("Middleware check:", {
    path: url.pathname,
    hasUuid: !!studentUuid,
    hasSubmitted,
  });

  // ✅ BLOCK questionnaire if cookie exists
  if (url.pathname === "/questionaire" && hasSubmitted) {
    console.log("Blocking questionnaire - already submitted");
    url.pathname = "/status";
    return NextResponse.redirect(url);
  }

  // Guest-only pages
  if (
    (url.pathname === "/login" || url.pathname === "/register") &&
    studentUuid
  ) {
    url.pathname = "/status";
    return NextResponse.redirect(url);
  }

  // Protected pages (require login)
  if (
    (url.pathname === "/questionaire" || url.pathname === "/status") &&
    !studentUuid
  ) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/questionaire", "/status"],
};
