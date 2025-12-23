// "use server";

// import OpenAI from "openai";
// import { db } from "@/src/lib/database";
// import { questionnaireResponses, aiTraits } from "@/src/lib/schema";
// import { eq } from "drizzle-orm";
// import { buildPrompt } from "./build-prompt";
// import { validateTraits } from "./validate-traits";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function generateAITraitsForAllUsers() {
//   const responses = await db.select().from(questionnaireResponses);

//   let processed = 0;
//   let skipped = 0;

//   for (const entry of responses) {
//     const studentId = entry.studentId;

//     // Skip if traits already exist
//     const existing = await db
//       .select()
//       .from(aiTraits)
//       .where(eq(aiTraits.studentId, studentId))
//       .limit(1);

//     if (existing.length > 0) {
//       skipped++;
//       continue;
//     }

//     try {
//       const prompt = buildPrompt(entry.responses);

//       const completion = await openai.chat.completions.create({
//         model: "gpt-4o-mini",
//         temperature: 0.3,
//         messages: [
//           { role: "system", content: "Output only valid JSON." },
//           { role: "user", content: prompt },
//         ],
//       });

//       const content = completion.choices[0].message.content;
//       if (!content) throw new Error("Empty AI response");

//       const traits = JSON.parse(content);
//       validateTraits(traits);

//       await db.insert(aiTraits).values({
//         studentId,
//         chronotype: traits.chronotype,
//         noiseSensitivity: traits.noiseSensitivity,
//         sociability: traits.sociability,
//         studyFocus: traits.studyFocus,
//         generatedAt: new Date().toISOString(),
//       });

//       processed++;
//     } catch (err) {
//       console.error(`AI failed for student ${studentId}`, err);
//       continue;
//     }
//   }

//   return {
//     success: true,
//     processed,
//     skipped,
//   };
// }

"use server";

import { db } from "@/src/lib/database";
import { questionnaireResponses, aiTraits } from "@/src/lib/schema";
import { eq } from "drizzle-orm";

export async function generateAITraitsForAllUsers() {
  const responses = await db.select().from(questionnaireResponses);

  let processed = 0;
  let skipped = 0;

  for (const entry of responses) {
    const studentId = entry.studentId;

    // Skip if traits already exist
    const existing = await db
      .select()
      .from(aiTraits)
      .where(eq(aiTraits.studentId, studentId))
      .limit(1);

    if (existing.length > 0) {
      skipped++;
      continue;
    }

    // ---------- RULE ENGINE ----------
    const get = (key: string) =>
      entry.responses.find((r: any) => r.questionId.includes(key))?.answer;

    const sleep = get("sleepSchedule");
    const noise = get("noiseTolerance");
    const social = get("socialPreference");
    const study = get("studyHours");

    const traits = {
      chronotype:
        sleep === "night"
          ? 7
          : sleep === "average"
            ? 4
            : sleep === "early"
              ? 1
              : 4,

      noiseSensitivity:
        noise === "quiet"
          ? 1
          : noise === "low"
            ? 3
            : noise === "moderate"
              ? 5
              : noise === "high"
                ? 7
                : 4,

      sociability:
        social === "very"
          ? 7
          : social === "moderate"
            ? 5
            : social === "quiet"
              ? 2
              : 4,

      studyFocus:
        study === "7+"
          ? 7
          : study === "5-6"
            ? 6
            : study === "3-4"
              ? 4
              : study === "1-2"
                ? 2
                : 4,
    };

    // ---------- VALIDATION ----------
    for (const [key, value] of Object.entries(traits)) {
      if (typeof value !== "number" || value < 1 || value > 7) {
        throw new Error(`Invalid ${key}: ${value}`);
      }
    }

    // ---------- SAVE ----------
    await db.insert(aiTraits).values({
      studentId,
      ...traits,
      generatedAt: new Date().toISOString(),
    });

    processed++;
  }

  return {
    success: true,
    processed,
    skipped,
    mode: "rule-based",
  };
}
