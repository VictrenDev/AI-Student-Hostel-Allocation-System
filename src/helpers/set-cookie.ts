export async function setStudentCookie(studentUuid: string) {
  try {
    const res = await fetch("/api/set-student-cookie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentUuid }),
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error("Failed to set session cookie");
    }

    return data;
  } catch (err) {
    console.error("Error setting student cookie:", err);
    return { success: false, error: (err as Error).message };
  }
}
