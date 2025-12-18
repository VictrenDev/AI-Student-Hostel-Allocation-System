// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const studentUuid = req.cookies.get("student_uuid")?.value;
  console.log(studentUuid);
  // Guest-only pages
  if (
    (url.pathname === "/login" || url.pathname === "/register") &&
    studentUuid
  ) {
    url.pathname = "/questionaire"; // Redirect logged-in user to dashboard
    return NextResponse.redirect(url);
  }

  // Protected pages
  if (
    (url.pathname === "/questionaire" || url.pathname === "/status") &&
    !studentUuid
  ) {
    url.pathname = "/login"; // Redirect guest to login
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/questionaire", "/status"],
};
