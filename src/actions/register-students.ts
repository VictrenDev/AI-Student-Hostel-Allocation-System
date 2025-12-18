"use server";

import { db } from "@/src/lib/database";
import { students, Student } from "@/src/lib/schema";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { registrationServerSchema } from "../zod/registeration-server";

type RegisterStudentReturnType =
  | { success: true; message: string; student: Student; studentUuid: string }
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
      return { success: false, error: "Student creation failed" };
    }

    return {
      success: true,
      message: "Registration successful",
      student,
      studentUuid,
    };
  } catch (error) {
    console.error("Error registering student", error);
    return { success: false, error: "Internal server error" };
  }
};

export default registerStudent;
