// app/api/check-questionnaire/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/src/lib/database";
import { students, questionnaireResponses } from "@/src/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const studentUuid = cookieStore.get("student_uuid")?.value;

    if (!studentUuid) {
      return NextResponse.json({ hasSubmitted: false });
    }

    // Check database
    const [student] = await db
      .select({ id: students.id })
      .from(students)
      .where(eq(students.uuid, studentUuid))
      .limit(1);

    if (!student) {
      return NextResponse.json({ hasSubmitted: false });
    }

    const [questionnaire] = await db
      .select()
      .from(questionnaireResponses)
      .where(eq(questionnaireResponses.studentId, student.id))
      .limit(1);

    return NextResponse.json({
      hasSubmitted: !!questionnaire,
      submittedAt: questionnaire?.submittedAt || null,
    });
  } catch (error) {
    console.error("API check error:", error);
    return NextResponse.json({ hasSubmitted: false });
  }
}
