"use server";

import { runAllocation } from "@/src/actions/admin/run-allocation";

export async function allocateStudentsAction() {
  await runAllocation();
}
