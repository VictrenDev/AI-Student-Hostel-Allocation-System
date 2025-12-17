import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/lib/database"; // your Drizzle DB instance
import { students } from "@/src/lib/schema"; // your Drizzle table

export async function GET(req: NextRequest) {
  try {
    // Fetch all students
    const allStudents = await db.select().from(students);

    return NextResponse.json({ users: allStudents }, { status: 200 });
  } catch (err) {
    console.error("Error fetching users:", err);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
