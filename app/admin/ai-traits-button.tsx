"use client";

import { useState, useTransition } from "react";
import { generateAITraitsForAllUsers } from "@/src/lib/ai/generate-ai-traits";

export default function GenerateAITraitsButton() {
  const [result, setResult] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const res = await generateAITraitsForAllUsers();
      setResult(res);
    });
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleClick}
        disabled={isPending}
        className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? "Generating AI Traits..." : "Generate AI Traits"}
      </button>

      {result && (
        <div className="bg-gray-100 p-4 rounded text-sm">
          <p>✅ Processed: {result.processed}</p>
          <p>⏭ Skipped: {result.skipped}</p>
        </div>
      )}
    </div>
  );
}
