"use server";

import { db } from "@/src/lib/database";
import { students, Student } from "@/src/lib/schema";
import { registrationSchema } from "../zod/register-student";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";
type RegisterStudentReturnType =
  | { success: true; message: string; student: Student; studentUuid: string }
  | { success: false; error: string };

type RegisterStudentInput = z.infer<typeof registrationSchema>;
// type StudentInsert = Omit<RegisterStudentInput, "level"> & { level: "100" | "200" | "300" | "400" | "500" };

const registerStudent = async (
  input: unknown,
): Promise<RegisterStudentReturnType> => {
  const parsedData = registrationSchema.safeParse(input);

  if (!parsedData.success) {
    return {
      success: false,
      error: "Data could not be passed sucessfully",
    };
  }
  const data: RegisterStudentInput = parsedData.data;
  const studentUuid = uuidv4();
  const levelMap: Record<
    RegisterStudentInput["level"],
    "100" | "200" | "300" | "400" | "500"
  > = {
    freshman: "100",
    sophomore: "200",
    junior: "300",
    senior: "400",
    postgrad: "500",
  };
  try {
    const [student] = await db
      .insert(students)
      .values({
        name: data.name,
        uuid: studentUuid,
        gender: data.gender,
        matricNo: data.matricNo,
        email: data.email,
        level: levelMap[data.level],
        createdAt: new Date().toISOString(),
      })
      .returning();

    return {
      success: true,
      message: "Registration successful",
      student,
      studentUuid,
    };
  } catch (error) {
    console.error("Error registering student", error);

    return {
      success: false,
      error: "Internal server error",
    };
  }
};

export default registerStudent;
