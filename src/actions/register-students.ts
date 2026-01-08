"use server";

import { db } from "@/src/lib/database";
import { students, Student } from "@/src/lib/schema";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { registrationServerSchema } from "../zod/registeration-server";
import { cookies } from "next/headers";

type RegisterStudentReturnType =
  | { success: true; message: string; }
  | { success: false; error: string };

type RegisterStudentInput = z.infer<typeof registrationServerSchema>;

const registerStudent = async (
  input: unknown,
): Promise<RegisterStudentReturnType> => {
  const parsed = registrationServerSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: "Invalid registration data" };
  }

  const data: RegisterStudentInput = parsed.data;
  const studentUuid = uuidv4();

  try {
    const result = await db
      .insert(students)
      .values({
        name: data.name,
        uuid: studentUuid,
        gender: data.gender,
        matricNo: data.matricNo,
        email: data.email,
        level: data.level,
        createdAt: new Date().toISOString(),
      })
      .returning();
    const student = result[0];

    if (!student) {
      return { success: false, error: "Failded to create student" };
    }
    const setStudentCookies = await cookies()
    setStudentCookies.set({
      name: "student_uuid",
      value: student.uuid,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })
    return {
      success: true,
      message: "Registration successful",

    };
  } catch (error) {
    console.error("Error registering student", error);
    return { success: false, error: "Internal server error" };
  }
};

export default registerStudent;
