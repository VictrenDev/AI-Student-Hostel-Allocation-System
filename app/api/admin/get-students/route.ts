// app/api/admin/get-students/route.ts
import { NextResponse } from "next/server";
import { db } from "@/src/lib/database";
import { students, questionnaireResponses, aiTraits } from "@/src/lib/schema";
import { desc, eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    console.log("🔄 Fetching students with Drizzle ORM...");

    // Method 1: Using Drizzle's ORM syntax (cleaner)
    const allStudents = await db
      .select({
        // Student fields
        id: students.id,
        uuid: students.uuid,
        name: students.name,
        email: students.email,
        gender: students.gender,
        level: students.level,
        matricNo: students.matricNo,
        createdAt: students.createdAt,

        // Questionnaire fields (latest)
        questionnaire: questionnaireResponses.responses,
        questionnaireSubmittedAt: questionnaireResponses.submittedAt,

        // AI Traits fields
        aiChronotype: aiTraits.chronotype,
        aiNoiseSensitivity: aiTraits.noiseSensitivity,
        aiSociability: aiTraits.sociability,
        aiStudyFocus: aiTraits.studyFocus,
        aiGeneratedAt: aiTraits.generatedAt,
      })
      .from(students)
      .leftJoin(
        questionnaireResponses,
        eq(students.id, questionnaireResponses.studentId),
      )
      .leftJoin(aiTraits, eq(students.id, aiTraits.studentId))
      .orderBy(desc(students.createdAt));

    console.log(`✅ Found ${allStudents.length} records`);

    // Method 2: If you want to get the LATEST questionnaire/aiTraits per student
    // This handles cases where a student might have multiple entries
    const studentsData = await db
      .select({
        id: students.id,
        uuid: students.uuid,
        name: students.name,
        email: students.email,
        gender: students.gender,
        level: students.level,
        matricNo: students.matricNo,
        createdAt: students.createdAt,
      })
      .from(students)
      .orderBy(desc(students.createdAt));

    // Get latest questionnaire for each student
    const usersWithDetails = await Promise.all(
      studentsData.map(async (student) => {
        const [latestQuestionnaire] = await db
          .select({
            responses: questionnaireResponses.responses,
            submittedAt: questionnaireResponses.submittedAt,
          })
          .from(questionnaireResponses)
          .where(eq(questionnaireResponses.studentId, student.id))
          .orderBy(desc(questionnaireResponses.submittedAt))
          .limit(1);

        const [latestAiTraits] = await db
          .select({
            chronotype: aiTraits.chronotype,
            noiseSensitivity: aiTraits.noiseSensitivity,
            sociability: aiTraits.sociability,
            studyFocus: aiTraits.studyFocus,
            generatedAt: aiTraits.generatedAt,
          })
          .from(aiTraits)
          .where(eq(aiTraits.studentId, student.id))
          .orderBy(desc(aiTraits.generatedAt))
          .limit(1);

        return {
          ...student,
          questionnaire: latestQuestionnaire?.responses || null,
          questionnaireSubmittedAt: latestQuestionnaire?.submittedAt || null,
          aiChronotype: latestAiTraits?.chronotype || null,
          aiNoiseSensitivity: latestAiTraits?.noiseSensitivity || null,
          aiSociability: latestAiTraits?.sociability || null,
          aiStudyFocus: latestAiTraits?.studyFocus || null,
          aiGeneratedAt: latestAiTraits?.generatedAt || null,
        };
      }),
    );

    console.log(`✅ Processed ${usersWithDetails.length} students`);

    return NextResponse.json({
      success: true,
      users: usersWithDetails,
      count: usersWithDetails.length,
    });
  } catch (err: any) {
    console.error("❌ Drizzle ORM Error:", {
      message: err.message,
      stack: err.stack,
    });

    // Fallback to raw SQL if Drizzle fails
    try {
      console.log("🔄 Falling back to raw SQL...");
      return await getWithRawSQL();
    } catch (fallbackErr: any) {
      console.error("❌ Raw SQL fallback also failed:", fallbackErr);

      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch users",
          details:
            process.env.NODE_ENV === "development"
              ? {
                  drizzleError: err.message,
                  sqlError: fallbackErr.message,
                }
              : undefined,
        },
        { status: 500 },
      );
    }
  }
}

// Keep your working raw SQL function as fallback
async function getWithRawSQL() {
  const students = await db.all(sql`
    SELECT
      id,
      uuid,
      name,
      email,
      gender,
      level,
      matriculation_number as matricNo,
      created_at as createdAt
    FROM students
    ORDER BY created_at DESC
  `);

  const usersWithDetails = await Promise.all(
    students.map(async (student) => {
      const questionnaireResult = await db.all(sql`
        SELECT responses, submitted_at as submittedAt
        FROM questionnaire_responses
        WHERE student_id = ${student.id}
        ORDER BY submitted_at DESC
        LIMIT 1
      `);

      const aiTraitsResult = await db.all(sql`
        SELECT
          chronotype,
          noise_sensitivity as noiseSensitivity,
          sociability,
          study_focus as studyFocus,
          generated_at as generatedAt
        FROM ai_traits
        WHERE student_id = ${student.id}
        ORDER BY generated_at DESC
        LIMIT 1
      `);

      let questionnaire = null;
      if (questionnaireResult.length > 0) {
        try {
          questionnaire =
            typeof questionnaireResult[0].responses === "string"
              ? JSON.parse(questionnaireResult[0].responses)
              : questionnaireResult[0].responses;
        } catch (e) {
          console.warn(
            `Failed to parse questionnaire for student ${student.id}:`,
            e,
          );
        }
      }

      return {
        ...student,
        questionnaire,
        questionnaireSubmittedAt: questionnaireResult[0]?.submittedAt || null,
        aiChronotype: aiTraitsResult[0]?.chronotype || null,
        aiNoiseSensitivity: aiTraitsResult[0]?.noiseSensitivity || null,
        aiSociability: aiTraitsResult[0]?.sociability || null,
        aiStudyFocus: aiTraitsResult[0]?.studyFocus || null,
        aiGeneratedAt: aiTraitsResult[0]?.generatedAt || null,
      };
    }),
  );

  return NextResponse.json({
    success: true,
    users: usersWithDetails,
    count: usersWithDetails.length,
  });
}
