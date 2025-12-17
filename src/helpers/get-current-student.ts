import { cookies } from "next/headers";
import { db } from "@/src/lib/database";
import { students } from "@/src/lib/schema";

export const getCurrentStudent = async () => {
  const cookieStore = cookies();
  const studentUuid = cookieStore.get("studentUuid")?.value;

  if (!studentUuid) return null;

  const [student] = await db
    .select()
    .from(students)
    .where(students.uuid.eq(studentUuid))
    .limit(1);

  return student ?? null; // null if not found
};
