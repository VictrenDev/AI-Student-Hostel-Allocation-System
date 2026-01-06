"use server";

import { eq } from "drizzle-orm";
import { db } from "../lib/database";
import {
  students,
  questionnaireResponses,
  aiTraits,
  hostels,
  rooms,
  allocations,
} from "../lib/schema";
import { randomUUID } from "crypto";

const levels = ["100", "200", "300", "400", "500"] as const;

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function trait(base: number) {
  return Math.min(7, Math.max(1, base + Math.floor(Math.random() * 3 - 1)));
}

export async function seedStudentsAction() {
  console.log("🌱 Starting database seeding...");

  try {
    // --- CLEAR DATABASE ---
    console.log(
      "🧹 Clearing existing students, questionnaires, and AI traits...",
    );
    await db.delete(questionnaireResponses).execute();
    await db.delete(aiTraits).execute();
    await db.delete(students).execute();
    // await db.delete(hostels).execute();
    // await db.delete(rooms).execute();
    // await db.delete(allocations).execute();
    console.log("✅ Database cleared.");

    // --- INSERT STUDENTS ---
    for (let i = 1; i <= 100; i++) {
      const gender = i <= 50 ? "male" : "female";
      const studentUUID = randomUUID();

      console.log(
        `Seeding student ${i}: ${gender === "male" ? "John" : "Jane"} Student ${i}`,
      );

      // Insert student
      await db.insert(students).values({
        uuid: studentUUID,
        email: `student${i}@school.edu`,
        name: `${gender === "male" ? "John" : "Jane"} Student ${i}`,
        gender,
        level: randomFrom(levels),
        matricNo: `MAT/${String(i).padStart(4, "0")}`,
        createdAt: new Date().toISOString(),
      });

      // Retrieve auto-incremented student ID
      const [insertedStudent] = await db
        .select({ id: students.id })
        .from(students)
        .where(eq(students.uuid, studentUUID));

      const studentId = insertedStudent.id;
      console.log(`Student ${i} inserted with id: ${studentId}`);

      // Insert questionnaire responses
      await db.insert(questionnaireResponses).values({
        studentId,
        responses: [
          {
            questionId: "sleepSchedule",
            answer: randomFrom(["early", "average", "night"]),
          },
          {
            questionId: "noiseTolerance",
            answer: randomFrom(["quiet", "low", "moderate", "high"]),
          },
          {
            questionId: "socialPreference",
            answer: randomFrom(["quiet", "moderate", "very"]),
          },
          {
            questionId: "studyHours",
            answer: randomFrom(["1-2", "3-4", "5-6", "7+"]),
          },
        ],
        submittedAt: new Date().toISOString(),
      });
      console.log(`Questionnaire for student ${i} inserted.`);

      // Insert AI traits
      const base = Math.floor(Math.random() * 3) + 3;
      await db.insert(aiTraits).values({
        studentId,
        chronotype: trait(base),
        noiseSensitivity: trait(base),
        sociability: trait(base),
        studyFocus: trait(base),
        generatedAt: new Date().toISOString(),
      });
      console.log(`AI traits for student ${i} inserted.`);
    }

    console.log("✅ Database seeding completed successfully!");
    return "Seeding completed";
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    throw err;
  }
}
