import { db } from "@/src/lib/database";
import {
  students,
  rooms,
  hostels,
  aiTraits,
  allocations,
} from "@/src/lib/schema";
import { eq, and, isNull, sql } from "drizzle-orm";

function compatibility(a: any, b: any) {
  return (
    Math.abs(a.chronotype - b.chronotype) +
    Math.abs(a.noiseSensitivity - b.noiseSensitivity) +
    Math.abs(a.sociability - b.sociability) +
    Math.abs(a.studyFocus - b.studyFocus)
  );
}

export async function runAllocation() {
  console.log("🚀 Allocation started");

  try {
    // Fetch unallocated students with traits
    const unallocatedStudents = await db
      .select({
        student: students,
        traits: aiTraits,
      })
      .from(students)
      .innerJoin(aiTraits, eq(aiTraits.studentId, students.id))
      .leftJoin(allocations, eq(allocations.studentId, students.id))
      .where(isNull(allocations.studentId));

    console.log(`👥 Found ${unallocatedStudents.length} unallocated students`);

    for (const entry of unallocatedStudents) {
      const { student, traits } = entry;

      console.log(`➡️ Allocating student: ${student.name} (${student.id})`);

      try {
        // 2️⃣ Fetch rooms with space & gender match
        const candidateRooms = await db
          .select({
            room: rooms,
            hostel: hostels,
          })
          .from(rooms)
          .innerJoin(hostels, eq(rooms.hostelId, hostels.id))
          .where(
            and(
              sql`${rooms.occupied} < ${rooms.capacity}`,
              sql`(${hostels.gender} = ${student.gender} OR ${hostels.gender} = 'mixed')`,
            ),
          );

        if (candidateRooms.length === 0) {
          console.warn(
            `⚠️ No available rooms for student ${student.id} (${student.gender})`,
          );
          continue;
        }

        let bestRoom: typeof rooms.$inferSelect | null = null;
        let bestScore = Infinity;

        // 3️⃣ Score each room
        for (const { room } of candidateRooms) {
          const occupants = await db
            .select({ traits: aiTraits })
            .from(allocations)
            .innerJoin(aiTraits, eq(aiTraits.studentId, allocations.studentId))
            .where(eq(allocations.roomId, room.id));

          let score = 0;

          if (occupants.length > 0) {
            score =
              occupants.reduce(
                (sum, o) => sum + compatibility(traits, o.traits),
                0,
              ) / occupants.length;
          }

          if (score < bestScore) {
            bestScore = score;
            bestRoom = room;
          }
        }

        if (!bestRoom) {
          console.warn(`⚠️ No suitable room found for student ${student.id}`);
          continue;
        }

        // 4️⃣ Allocate student
        await db.insert(allocations).values({
          studentId: student.id,
          roomId: bestRoom.id,
          compatibilityScore: Math.round(bestScore),
          explanation: "Allocated based on trait compatibility",
          allocatedAt: new Date().toISOString(),
        });

        // 5️⃣ Update room occupancy
        await db
          .update(rooms)
          .set({ occupied: sql`${rooms.occupied} + 1` })
          .where(eq(rooms.id, bestRoom.id));

        console.log(
          `✅ Student ${student.id} allocated to room ${bestRoom.roomNumber}`,
        );
      } catch (studentError) {
        console.error(
          `❌ Failed allocating student ${student.id}`,
          studentError,
        );
        // Continue with next student
      }
    }

    console.log("🎉 Allocation completed successfully");
    return { success: true };
  } catch (fatalError) {
    console.error("🔥 Allocation process failed", fatalError);
    throw fatalError;
  }
}
