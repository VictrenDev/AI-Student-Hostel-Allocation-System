import { cookies } from "next/headers";
import { db } from "@/src/lib/database";
import { students } from "@/src/lib/schema";
import { eq } from "drizzle-orm";

export const getCurrentStudent = async () => {
  const cookieStore = await cookies();
  const studentUuid = cookieStore.get("studentUuid")?.value;

  if (!studentUuid) return null;

  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.uuid, studentUuid))
    .limit(1);

  return student ?? null; // null if not found
};
