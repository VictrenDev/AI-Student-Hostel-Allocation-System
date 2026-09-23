// src/actions/admin/clear-database.ts
"use server";

import { db } from "@/src/lib/database";
import {
  allocations,
  aiTraits,
  questionnaireResponses,
  students,
  rooms,
  hostels,
} from "@/src/lib/schema";

export async function clearDatabaseAction() {
  console.log("🧹 Clearing database...");

  try {
    // Delete in dependency order: children first, then parents.
    // allocations -> references students & rooms
    await db.delete(allocations).execute();

    // aiTraits & questionnaireResponses -> reference students
    await db.delete(aiTraits).execute();
    await db.delete(questionnaireResponses).execute();

    // students -> no dependents left now
    await db.delete(students).execute();

    // rooms -> references hostels
    await db.delete(rooms).execute();

    // hostels -> no dependents left now
    await db.delete(hostels).execute();

    console.log("✅ Database cleared successfully.");
    return { success: true };
  } catch (error) {
    console.error("❌ Failed to clear database:", error);
    throw new Error("Something went wrong while clearing the database");
  }
}
