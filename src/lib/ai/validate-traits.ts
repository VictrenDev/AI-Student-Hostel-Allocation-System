export function validateTraits(traits: any) {
  const keys = ["chronotype", "noiseSensitivity", "sociability", "studyFocus"];

  for (const key of keys) {
    const value = traits[key];
    if (typeof value !== "number" || value < 1 || value > 7) {
      throw new Error(`Invalid trait ${key}: ${value}`);
    }
  }
}
