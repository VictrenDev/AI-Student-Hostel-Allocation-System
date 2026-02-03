"use server";

import { db } from "@/src/lib/database";
import { hostels, rooms, allocations } from "@/src/lib/schema";
import { eq, inArray } from "drizzle-orm";

/**
 * Delete a hostel and all related data
 */
export async function deleteHostelAction(hostelId: number) {
  try {
    // Wrap in a transaction
    await db.transaction(async (tx) => {
      // 1️⃣ Find all rooms in the hostel
      const hostelRooms = await tx
        .select({ id: rooms.id })
        .from(rooms)
        .where(eq(rooms.hostelId, hostelId));

      const roomIds = hostelRooms.map(r => r.id);

      if (roomIds.length > 0) {
        // 2️⃣ Delete all allocations in those rooms
        await tx.delete(allocations).where(inArray(allocations.roomId, roomIds));

      }

      // 3️⃣ Delete all rooms in the hostel
      await tx.delete(rooms).where(eq(rooms.hostelId, hostelId));

      // 4️⃣ Delete the hostel itself
      await tx.delete(hostels).where(eq(hostels.id, hostelId));
    });

    return { success: true, message: "Hostel and related data deleted successfully." };
  } catch (error) {
    console.error("Failed to delete hostel:", error);
    return { success: false, message: "Failed to delete hostel." };
  }
}
