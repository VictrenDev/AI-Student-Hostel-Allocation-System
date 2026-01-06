"use server";

import { db } from "@/src/lib/database";
import { hostels, Room, rooms } from "@/src/lib/schema";

type ReturnType =
  | { success: true; hostelId: number }
  | { success: false; error: unknown };
export async function createHostelWithRooms({
  name,
  gender,
  location,
  totalRooms,
  capacityPerRoom,
  wardenName,
}: {
  name: string;
  gender: "male" | "female" | "mixed";
  location: string;
  totalRooms: number;
  capacityPerRoom: number;
  wardenName: string;
}): Promise<ReturnType> {
  const createdAt = new Date().toISOString();

  try {
    const [hostel] = await db
      .insert(hostels)
      .values({
        name,
        gender,
        location,
        warden: wardenName,
        createdAt,
      })
      .returning();

    const roomRows = Array.from({ length: totalRooms }).map((_, i) => ({
      hostelId: hostel.id,
      roomNumber: `R-${i + 1}`,
      capacity: capacityPerRoom,
      occupied: 0,
    }));

    await db.insert(rooms).values(roomRows);
    return { success: true, hostelId: hostel.id };
  } catch (err) {
    return { success: false, error: err };
  }
}
