"use server";

import { db } from "@/src/lib/database";
import {
  students,
  allocations,
  rooms,
  hostels,
  aiTraits,
} from "@/src/lib/schema";
import { eq, and, ne } from "drizzle-orm";

export async function getAdminStudentById(studentId: number) {
  /** 1️⃣ Fetch student */
  const student = await db.query.students.findFirst({
    where: eq(students.id, studentId),
  });

  if (!student) return null;

  /** 2️⃣ Get allocation */
  const allocation = await db.query.allocations.findFirst({
    where: eq(allocations.studentId, studentId),
  });

  let room = null;
  let roommates: any[] = [];

  if (allocation) {
    /** 3️⃣ Fetch room + hostel */
    const roomData = await db
      .select({
        roomNumber: rooms.roomNumber,
        block: rooms.id,
        hostel: hostels.name,
        warden: hostels.warden,
        wardenContact: hostels.location,
      })
      .from(rooms)
      .innerJoin(hostels, eq(rooms.hostelId, hostels.id))
      .where(eq(rooms.id, allocation.roomId))
      .get();

    room = roomData;

    /** 4️⃣ Fetch roommates (same room, different student) */
    roommates = await db
      .select({
        id: students.id,
        name: students.name,
        email: students.email,
        aiTraits: aiTraits,
      })
      .from(allocations)
      .innerJoin(students, eq(allocations.studentId, students.id))
      .leftJoin(aiTraits, eq(aiTraits.studentId, students.id))
      .where(
        and(
          eq(allocations.roomId, allocation.roomId),
          ne(allocations.studentId, studentId),
        ),
      );
  }

  /** 5️⃣ Fetch this student’s traits */
  const traits = await db.query.aiTraits.findFirst({
    where: eq(aiTraits.studentId, studentId),
  });

  return {
    student: {
      ...student,
      room,
      roommates, // ✅ THIS is what you want
      aiTraits: traits,
    },
  };
}
