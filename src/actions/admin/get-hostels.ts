"use server";

import { db } from "@/src/lib/database";
import { hostels } from "@/src/lib/schema";
import { eq } from "drizzle-orm";

export async function getAllHostelsWithRooms() {
  try {
    // This fetches all hostels and their related rooms in one go
    const data = await db.query.hostels.findMany({
      with: {
        rooms: true,
      },
    });

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err };
  }
}

export async function getHostelWithRooms({ id }: { id: number }) {
  try {
    const data = await db.query.hostels.findFirst({
      where: eq(hostels.id, id),
      with: {
        rooms: true,
      },
    });
    console.log(data);
    if (!data) {
      return { success: false, error: "Hostel not found" };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err };
  }
}
