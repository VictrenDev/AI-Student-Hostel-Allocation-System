import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/lib/database";
import { students, genderEnum } from "@/src/lib/schema";

type RegistrationData = {
  name: string;
  gender: "male" | "female";
  level: "100" | "200" | "300" | "400" | "500"; // already mapped
  bio?: string;
};

export async function POST(req: NextRequest) {
  try {
    const data: RegistrationData = await req.json();

    if (!data.name || !data.gender || !data.level) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate gender
    if (!genderEnum.includes(data.gender)) {
      return NextResponse.json({ error: "Invalid gender" }, { status: 400 });
    }

    // Insert into database
    const newStudent = await db
      .insert(students)
      .values({
        name: data.name,
        gender: data.gender,
        level: data.level, // directly use frontend-mapped level
        createdAt: new Date().toISOString(),
        // bio: data.bio || null, // uncomment if bio exists in table
      })
      .returning();

    return NextResponse.json(
      { message: "Registration successful", student: newStudent },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error saving registration:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
