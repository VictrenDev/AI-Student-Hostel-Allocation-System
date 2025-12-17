import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/lib/database"; // your Drizzle SQLite client
import { students, questionnaireResponses, aiTraits } from "@/src/lib/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { studentId, habits, personality, routine, hobbies, academic } = body;

    // Insert student (or assume student already exists)
    const newStudent = await db
      .insert(students)
      .values({
        name: habits.name || "Anonymous",
        gender: habits.gender,
        level: academic.level,
        createdAt: new Date().toISOString(),
      })
      .returning();

    const sid = newStudent[0].id;

    // Insert questionnaire responses
    await db.insert(questionnaireResponses).values({
      studentId: sid,
      responses: JSON.stringify([
        { questionId: "sleepSchedule", answer: habits.sleepSchedule },
        { questionId: "studyHours", answer: habits.studyHours },
        { questionId: "cleanliness", answer: habits.cleanliness },
        {
          questionId: "socialPreference",
          answer: personality.socialPreference,
        },
        { questionId: "personalityType", answer: personality.personalityType },
        { questionId: "noiseTolerance", answer: personality.noiseTolerance },
        { questionId: "morningPerson", answer: routine.morningPerson },
        { questionId: "studyLocation", answer: routine.studyLocation },
        { questionId: "weekendActivity", answer: routine.weekendActivity },
        { questionId: "hobbies", answer: hobbies.hobbies },
        { questionId: "musicPreference", answer: hobbies.musicPreference },
        { questionId: "sportsInterest", answer: hobbies.sportsInterest },
        { questionId: "major", answer: academic.major },
        { questionId: "studyStyle", answer: academic.studyStyle },
        { questionId: "academicGoals", answer: academic.academicGoals },
        { questionId: "libraryFrequency", answer: academic.libraryFrequency },
      ]),
      submittedAt: new Date().toISOString(),
    });

    // Insert AI traits placeholder (can be generated later)
    await db.insert(aiTraits).values({
      studentId: sid,
      chronotype: routine.morningPerson, // placeholder
      noiseSensitivity: personality.noiseTolerance,
      sociability: personality.personalityType,
      studyFocus: academic.studyStyle,
      generatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, studentId: sid });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
