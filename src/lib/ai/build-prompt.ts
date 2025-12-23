export function buildPrompt(responses: any[]) {
  return `
You are an AI system that converts student hostel questionnaire responses
into normalized lifestyle traits.

Return ONLY valid JSON in this exact format:

{
  "chronotype": number,
  "noiseSensitivity": number,
  "sociability": number,
  "studyFocus": number
}

Rules:
- Values must be integers between 1 and 7
- 1 = very low, 7 = very high
- Do NOT add explanations
- Do NOT add extra keys

Questionnaire responses:
${JSON.stringify(responses, null, 2)}
`;
}
