"use server";

import { cookies } from "next/headers";

export async function someAction() {
  const cookieStore = await cookies();
  const session = cookieStore.get("student_session");

  if (!session) {
    throw new Error("Unauthorized");
  }
}
