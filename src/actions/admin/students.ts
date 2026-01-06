"use server";

import { db } from "@/src/lib/database";
import {
  students,
  questionnaireResponses,
  allocations,
  rooms,
  hostels,
} from "@/src/lib/schema";
import { eq } from "drizzle-orm";

export async function getAdminStudents() {
  try {
    const rows = await db
      .select({
        id: students.id,
        name: students.name,
        email: students.email,
        gender: students.gender,
        level: students.level,
        matricNo: students.matricNo,
        createdAt: students.createdAt,

        questionnaireId: questionnaireResponses.studentId,

        hostelName: hostels.name,
        roomNumber: rooms.roomNumber,
      })
      .from(students)
      .leftJoin(
        questionnaireResponses,
        eq(questionnaireResponses.studentId, students.id),
      )
      .leftJoin(allocations, eq(allocations.studentId, students.id))
      .leftJoin(rooms, eq(rooms.id, allocations.roomId))
      .leftJoin(hostels, eq(hostels.id, rooms.hostelId));

    const formatted = rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      gender: row.gender,
      level: row.level,
      matricNo: row.matricNo,
      createdAt: row.createdAt,
      hasQuestionnaire: !!row.questionnaireId,
      hostelName: row.hostelName ?? null,
      roomNumber: row.roomNumber ?? null,
    }));

    return { success: true, students: formatted };
  } catch (error) {
    console.error("getAdminStudents error:", error);
    return { success: false, students: [] };
  }
}
