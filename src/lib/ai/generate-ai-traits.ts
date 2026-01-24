"use server";

import OpenAI from "openai";
import { db } from "@/src/lib/database";
import { questionnaireResponses, aiTraits } from "@/src/lib/schema";
import { eq } from "drizzle-orm";

/* ----------------------------- OpenAI Client ----------------------------- */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ----------------------------- Prompt Builder ----------------------------- */

function buildPrompt(responses: any[]) {
  return `
If information is unclear, use the neutral value 4.

Questionnaire data:
${JSON.stringify(responses)}
`;
}

/* ----------------------------- Validation -------------------------------- */

function validateTraits(traits: any) {
  const requiredKeys = [
    "chronotype",
    "noiseSensitivity",
    "sociability",
    "studyFocus",
  ];

  for (const key of requiredKeys) {
    const value = traits[key];

    if (!Number.isInteger(value)) {
      throw new Error(`Trait ${key} is not an integer: ${value}`);
    }

    if (value < 1 || value > 7) {
      throw new Error(`Trait ${key} out of range (1–7): ${value}`);
    }
  }

  const extraKeys = Object.keys(traits).filter(
    (k) => !requiredKeys.includes(k),
  );

  if (extraKeys.length > 0) {
    throw new Error(`Unexpected keys returned: ${extraKeys.join(", ")}`);
  }
}

/* ----------------------------- Main Action -------------------------------- */

export async function generateAITraitsForAllUsers() {
  const responses = await db.select().from(questionnaireResponses);

  let processed = 0;
  let skipped = 0;
  let failed = 0;

  for (const entry of responses) {
    const studentId = entry.studentId;

    /* ---------- Skip Existing ---------- */
    const existing = await db
      .select()
      .from(aiTraits)
      .where(eq(aiTraits.studentId, studentId))
      .limit(1);

    if (existing.length > 0) {
      skipped++;
      continue;
    }

    /* ---------- AI Generation ---------- */
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-5-nano",
        messages: [
          {
            role: "system",
            content:
              "You are a scoring engine. Output ONLY valid JSON. " +
              "Schema: { chronotype: int(1-7), noiseSensitivity: int(1-7), sociability: int(1-7), studyFocus: int(1-7) }. " +
              "No explanations. No extra keys.",
          },
          {
            role: "user",
            content: buildPrompt(entry.responses),
          },
        ],
      });

      const raw = completion.choices[0]?.message?.content;

      if (!raw) {
        throw new Error("Empty response from OpenAI");
      }

      let traits;
      try {
        traits = JSON.parse(raw);
      } catch {
        throw new Error(`Invalid JSON returned: ${raw}`);
      }
      console.log(traits)

      validateTraits(traits);

      await db.insert(aiTraits).values({
        studentId,
        chronotype: traits.chronotype,
        noiseSensitivity: traits.noiseSensitivity,
        sociability: traits.sociability,
        studyFocus: traits.studyFocus,
        generatedAt: new Date().toISOString(),
      });

      processed++;
      console.info("AI traits saved", {
        studentId,
        traits,
      });

      /* Optional rate-limit safety */
      await new Promise((r) => setTimeout(r, 150));
    } catch (err: any) {
      failed++;

      console.error("AI TRAIT GENERATION FAILED", {
        studentId,
        errorMessage: err?.message,
        errorStack: err?.stack,
        responses: entry.responses,
      });

      continue;
    }
  }

  return {
    success: true,
    processed,
    skipped,
    failed,
    mode: "ai",
    model: "gpt-5-nano",
  };
}
