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

// --- HOSTEL CONFIG ---
// 2 male hostels + 2 female hostels, each hostel gets a set of rooms.
const HOSTEL_CONFIG = [
  { name: "Alpha Hall", location: "North Campus", warden: "Mr. Adekunle", gender: "male" as const },
  { name: "Beta Hall", location: "North Campus", warden: "Mr. Chukwu", gender: "male" as const },
  { name: "Delta Hall", location: "South Campus", warden: "Mrs. Okoro", gender: "female" as const },
  { name: "Gamma Hall", location: "South Campus", warden: "Mrs. Ibe", gender: "female" as const },
];

const ROOM_CAPACITY = 4; // students per room
const ROOMS_PER_HOSTEL = 10; // enough rooms per hostel to hold students comfortably

export async function seedStudentsAction(totalNumberOfSeededStudents: number) {
  console.log("🌱 Starting database seeding...");

  try {
    // --- CLEAR DATABASE ---
    // console.log(
    //   "🧹 Clearing existing students, questionnaires, and AI traits...",
    // );
    // await db.delete(allocations).execute();
    // await db.delete(questionnaireResponses).execute();
    // await db.delete(aiTraits).execute();
    // await db.delete(rooms).execute();
    // await db.delete(hostels).execute();
    // await db.delete(students).execute();
    // console.log("✅ Database cleared.");

    // --- INSERT HOSTELS + ROOMS ---
    console.log("🏠 Seeding hostels and rooms...");

    for (const hostelDef of HOSTEL_CONFIG) {
      const [insertedHostel] = await db
        .insert(hostels)
        .values({
          name: hostelDef.name,
          location: hostelDef.location,
          warden: hostelDef.warden,
          gender: hostelDef.gender,
          createdAt: new Date().toISOString(),
        })
        .returning({ id: hostels.id });

      const hostelId = insertedHostel.id;
      console.log(`  Hostel "${hostelDef.name}" (${hostelDef.gender}) inserted with id: ${hostelId}`);

      for (let r = 1; r <= ROOMS_PER_HOSTEL; r++) {
        await db.insert(rooms).values({
          hostelId,
          roomNumber: `${hostelDef.name.split(" ")[0].slice(0, 1).toUpperCase()}-${String(r).padStart(3, "0")}`,
          capacity: ROOM_CAPACITY,
          occupied: 0,
        });
      }
    }

    console.log("✅ Hostels and rooms seeded.");

    // --- INSERT STUDENTS ---
    for (let i = 1; i <= totalNumberOfSeededStudents; i++) {
      const gender = i <= Math.round(totalNumberOfSeededStudents / 2) ? "male" : "female";
      const studentUUID = randomUUID();

      console.log(
        `Seeding student ${i}: ${gender === "male" ? "John" : "Jane"} Student ${i}`,
      );

      // Insert student
      await db.insert(students).values({
        uuid: studentUUID,
        email: `student${randomUUID().replace(/-/g, "").slice(0, 7)}@school.edu`,
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
    }

    console.log("✅ Database seeding completed successfully!");
    return "Seeding completed";
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    throw err;
  }
}
