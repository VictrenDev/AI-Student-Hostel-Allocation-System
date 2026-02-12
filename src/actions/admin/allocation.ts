// "use server";

// import { runAllocation } from "@/src/actions/admin/run-allocation";

// export async function allocateStudentsAction() {
//   try {
//     await runAllocation();
//   }
//   catch (error) {
//     throw new Error("Something went wrong in allocating students")
//   }
// }

"use server";

import { runAllocation } from "@/src/actions/admin/run-allocation";

export async function allocateStudentsAction(onProgress?: (index: number, total: number) => void) {
  try {
    await runAllocation(onProgress); // make runAllocation report progress
  } catch (error) {
    throw new Error("Something went wrong in allocating students");
  }
}
