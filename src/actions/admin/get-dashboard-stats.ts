"use server";

import { db } from "@/src/lib/database";
import { rooms, students } from "@/src/lib/schema";
import { eq } from "drizzle-orm";

export async function getAdminDashboardStats() {
  const allStudents = await db.select().from(students);

  const allRooms = await db.select().from(rooms);

  const allocatedStudents = allStudents.filter(s => s.roomId !== null);

  const roomCompatibilities = allRooms.map(room => {
    const occupants = allStudents.filter(s => s.roomId === room.id).length;

    if (occupants === 0) return 0;

    return Math.round((occupants / room.capacity) * 100);
  });

  const averageCompatibility =
    roomCompatibilities.length === 0
      ? 0
      : Math.round(
        roomCompatibilities.reduce((a, b) => a + b, 0) /
        roomCompatibilities.length
      );

  const distribution = {
    "90-100%": roomCompatibilities.filter(c => c >= 90).length,
    "80-89%": roomCompatibilities.filter(c => c >= 80 && c < 90).length,
    "70-79%": roomCompatibilities.filter(c => c >= 70 && c < 80).length,
    "60-69%": roomCompatibilities.filter(c => c >= 60 && c < 70).length,
    "Below 60%": roomCompatibilities.filter(c => c < 60).length,
  };

  return {
    totalStudents: allStudents.length,
    withQuestionnaire: allStudents.filter(s => s.hasQuestionnaire).length,
    allocated: allocatedStudents.length,
    pendingAllocation: allStudents.length - allocatedStudents.length,
    averageCompatibility,
    distribution,
  };
}
