"use server";

import { db } from "@/src/lib/database";
import {
  questionnaireResponses,
  aiTraits,
  NewQuestionnaireResponse,
  NewAITrait,
} from "@/src/lib/schema";
import OpenAI from "openai";
import { getCurrentStudent } from "../helpers/get-current-student";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function submitQuestionnaire(formData: any) {
  try {
    // 1️⃣ Get current student
    const student = await getCurrentStudent();
    if (!student) {
      throw new Error("Student not found");
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

    console.log("💾 Saving responses (array length):", responses.length);

    // 3️⃣ Save raw responses - NO JSON.stringify()!
    await db.insert(questionnaireResponses).values({
      studentId,
      responses, // ← Just the array, Drizzle handles serialization
      submittedAt: new Date().toISOString(),
    });

    console.log("✅ Responses saved to database");

    // 4️⃣ Prepare and call OpenAI (your existing code)
    const prompt = `...`; // Your prompt here

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Output ONLY valid JSON with numeric scores 1-7.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    const normalizedTraits: any = JSON.parse(content);

    // Add validation (recommended)
    const isValid =
      normalizedTraits.chronotype >= 1 &&
      normalizedTraits.chronotype <= 7 &&
      normalizedTraits.noiseSensitivity >= 1 &&
      normalizedTraits.noiseSensitivity <= 7 &&
      normalizedTraits.sociability >= 1 &&
      normalizedTraits.sociability <= 7 &&
      normalizedTraits.studyFocus >= 1 &&
      normalizedTraits.studyFocus <= 7;

    if (!isValid) {
      throw new Error(
        `AI returned invalid scores: ${JSON.stringify(normalizedTraits)}`,
      );
    }

    // Add studentId and timestamp
    normalizedTraits.studentId = studentId;
    normalizedTraits.generatedAt = new Date().toISOString();

    // 5️⃣ Save AI traits
    await db.insert(aiTraits).values(normalizedTraits);

    return { success: true, traits: normalizedTraits };
  } catch (err) {
    console.error("submitQuestionnaire error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
