"use server";

import { db } from "@/src/lib/database";
import {
  students,
  questionnaireResponses,
  aiTraits,
  allocations,
  rooms,
  hostels,
} from "@/src/lib/schema";
import { eq, count } from "drizzle-orm";
import { cookies } from "next/headers";

/**
 * Allocation lifecycle states
 * - pending: questionnaire submitted, waiting
 * - processing: AI traits generated, allocation running
 * - completed: room allocated
 * - failed: edge case / delayed batch
 */
export async function getAllocationStatus() {
  // 1. Resolve student
  const cookieStore = await cookies();
  const studentUuid = cookieStore.get("student_uuid")?.value;
  if (!studentUuid) {
    return {
      success: false,
      error: "No session found for user"
    }
  }
  const student = await db.query.students.findFirst({
    where: eq(students.uuid, studentUuid),
  });

  if (!student) {
    throw new Error("Student not found");
  }

  // 2. Questionnaire submitted?
  const questionnaire = await db.query.questionnaireResponses.findFirst({
    where: eq(questionnaireResponses.studentId, student.id),
  });

  if (!questionnaire) {
    return {
      status: "pending",
      positionInQueue: null,
      totalStudents: await totalQueuedStudents(),
      estimatedCompletion: null,
      allocatedRoom: null,
      roommate: null,
      lastUpdated: new Date().toISOString(),
    };
  }

  // 3. AI traits generated?
  const traits = await db.query.aiTraits.findFirst({
    where: eq(aiTraits.studentId, student.id),
  });

  // 4. Allocation completed?
  const allocation = await db.query.allocations.findFirst({
    where: eq(allocations.studentId, student.id),
    with: {
      room: {
        with: {
          hostel: true,
        },
      },
    },
  });

  // COMPLETED
  if (allocation) {
    return {
      status: "completed",
      positionInQueue: 0,
      totalStudents: await totalQueuedStudents(),
      estimatedCompletion: allocation.allocatedAt,
      allocatedRoom: `${allocation.room.roomNumber} - ${allocation.room.hostel.name}`,
      roommate: "Assigned automatically", // optional enhancement later
      lastUpdated: allocation.allocatedAt,
    };
  }

  // PROCESSING
  if (traits) {
    return {
      status: "processing",
      positionInQueue: await queuePosition(student.id),
      totalStudents: await totalQueuedStudents(),
      estimatedCompletion: estimateCompletionDate(),
      allocatedRoom: null,
      roommate: null,
      lastUpdated: traits.generatedAt,
    };
  }

  // SUBMITTED BUT WAITING
  return {
    status: "pending",
    positionInQueue: await queuePosition(student.id),
    totalStudents: await totalQueuedStudents(),
    estimatedCompletion: estimateCompletionDate(),
    allocatedRoom: null,
    roommate: null,
    lastUpdated: questionnaire.submittedAt,
  };
}

/* ---------------- Helpers ---------------- */

async function totalQueuedStudents() {
  const result = await db
    .select({ value: count() })
    .from(questionnaireResponses);

  return result[0]?.value ?? 0;
}

async function queuePosition(studentId: number) {
  const result = await db
    .select({ value: count() })
    .from(questionnaireResponses)
    .where(eq(questionnaireResponses.studentId, studentId));

  return result[0]?.value ?? null;
}

function estimateCompletionDate() {
  const date = new Date();
  date.setDate(date.getDate() + 5); // batch-based estimate
  return date.toISOString();
}
