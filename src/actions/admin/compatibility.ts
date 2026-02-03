"use server";

import { db } from "@/src/lib/database";
import { allocations } from "@/src/lib/schema";
import { sql } from "drizzle-orm";

export async function getCompatibilityStats() {
  const EMPTY_DISTRIBUTION = {
    "90-100%": 0,
    "80-89%": 0,
    "70-79%": 0,
    "60-69%": 0,
    "Below 60%": 0,
  };

  try {
    const allocationsData = await db
      .select({ score: allocations.compatibilityScore })
      .from(allocations)
      .where(sql`${allocations.compatibilityScore} IS NOT NULL`);

    if (!allocationsData.length) {
      return {
        averageCompatibility: 0,
        totalAllocations: 0,
        distribution: EMPTY_DISTRIBUTION,
      };
    }

    // Normalize raw scores to percentage (0-100)
    const MAX_SCORE = 7; // <-- adjust based on your scoring system
    const scores: number[] = allocationsData.map(a =>
      Math.round(((a.score ?? 0) / MAX_SCORE) * 100)
    );

    const totalAllocations = scores.length;
    const averageCompatibility = Math.round(
      scores.reduce((sum, s) => sum + s, 0) / totalAllocations
    );

    const distribution = { ...EMPTY_DISTRIBUTION };
    for (const score of scores) {
      if (score >= 90) distribution["90-100%"]++;
      else if (score >= 80) distribution["80-89%"]++;
      else if (score >= 70) distribution["70-79%"]++;
      else if (score >= 60) distribution["60-69%"]++;
      else distribution["Below 60%"]++;
    }

    return {
      averageCompatibility,
      totalAllocations,
      distribution,
    };
  } catch (error) {
    console.error("Compatibility analytics failed:", error);

    return {
      averageCompatibility: 0,
      totalAllocations: 0,
      distribution: EMPTY_DISTRIBUTION,
    };
  }
}
