"use server";

import { db } from "@/src/lib/database";
import {
  questionnaireResponses,
} from "@/src/lib/schema";
import OpenAI from "openai";
import { getCurrentStudent } from "../helpers/get-current-student";
import { cookies } from "next/headers";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function submitQuestionnaire(formData: any) {
  try {
    // 1️⃣ Get current student
    const student = await getCurrentStudent();
    if (!student) {
      return {
        success: false,
        error: "No user with this credentials is found",
      };
    }
    const studentId = student.id;

    // 2️⃣ Prepare responses array
    const responses: any[] = [];

    Object.entries(formData).forEach(([section, sectionData]) => {
      if (sectionData && typeof sectionData === "object") {
        Object.entries(sectionData).forEach(([questionId, answer]) => {
          if (Array.isArray(answer)) {
            answer.forEach((item) => {
              responses.push({
                questionId: `${section}.${questionId}.${item}`,
                answer: true,
              });
            });
          } else {
            responses.push({
              questionId: `${section}.${questionId}`,
              answer: answer || "",
            });
          }
        });
      }
    });

    console.log("Saving responses (array length):", responses.length);

    // 3️⃣ Save raw responses - NO JSON.stringify()!
    const dbResponse = await db.insert(questionnaireResponses).values({
      studentId,
      responses, // ← Just the array, Drizzle handles serialization
      submittedAt: new Date().toISOString(),
    });
    if (!dbResponse) {
      return {
        success: false,
        error: "Something went wrong trying to save to database"
      }
    }
    console.log("✅ Responses saved to database");
    const cookieStore = await cookies();

    // Set the cookie
    cookieStore.set("questionnaire_submitted", "true", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
    return { success: true, }
  } catch (err) {
    console.error("submitQuestionnaire error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
