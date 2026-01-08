"use server";

import { eq } from "drizzle-orm";
import { db } from "../lib/database";
import { students } from "../lib/schema";
import { cookies } from "next/headers";
type LoginReturnType =
  | { success: true; studentUuid: string }
  | { success: false; error: string };
export async function loginStudent(email: string): Promise<LoginReturnType> {
  if (!email) {
    return {
      success: false,
      error: "Email is required",
    };
  }

  const student = await db
    .select()
    .from(students)
    .where(eq(students.email, email))
    .limit(1);

  if (!student[0]) {
    return { success: false, error: "Email not found" };
  }
  const studentUuid = student[0].uuid;
  // set cookie data on user login
  const setCookies = await cookies()
  setCookies.set({
    name: "student_uuid",
    value: studentUuid,
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });


  return { success: true, studentUuid };
}
