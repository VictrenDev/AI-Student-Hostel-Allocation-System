"use server";

import { cookies } from "next/headers";

export async function getCookie() {
  const cookieStore = await cookies();
  const cookieExist = cookieStore.get("student_uuid")?.value;
  return {
    isAuthenticated: Boolean(cookieExist),
  };
}
