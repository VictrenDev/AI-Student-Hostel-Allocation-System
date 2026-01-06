import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { relations } from "drizzle-orm";

/** ===== ENUMS ===== */
export const genderEnum = ["male", "female"] as const;
export const levelEnum = ["100", "200", "300", "400", "500"] as const;
export const hostelGenderEnum = ["male", "female", "mixed"] as const;
export const chronotypeEnum = ["morning", "evening", "flexible"] as const;
export const noiseEnum = ["low", "medium", "high"] as const;
export const sociabilityEnum = ["introvert", "ambivert", "extrovert"] as const;
export const focusEnum = ["deep", "moderate", "light"] as const;

/** ===== TYPES ===== */
export type QuestionnaireResponse = {
  questionId: string;
  answer: string | number | boolean;
};

/** ===== TABLES ===== */
export const students = sqliteTable("students", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  uuid: text("uuid").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  gender: text("gender", { enum: genderEnum }).notNull(),
  level: text("level", { enum: levelEnum }).notNull(),
  matricNo: text("matriculation_number").notNull(),
  createdAt: text("created_at").$type<string>().notNull(),
});

// src/lib/schema.ts
export const questionnaireResponses = sqliteTable("questionnaire_responses", {
  studentId: integer("student_id")
    .notNull()
    .references(() => students.id),
  responses: text("responses", { mode: "json" })
    .$type<QuestionnaireResponse[]>()
    .notNull(), // mode: 'json'
  submittedAt: text("submitted_at").$type<string>().notNull(),
});

export const aiTraits = sqliteTable("ai_traits", {
  studentId: integer("student_id")
    .notNull()
    .references(() => students.id),
  chronotype: integer("chronotype").notNull(),
  noiseSensitivity: integer("noise_sensitivity").notNull(),
  sociability: integer("sociability").notNull(),
  studyFocus: integer("study_focus").notNull(),
  generatedAt: text("generated_at").$type<string>().notNull(),
});

export const rooms = sqliteTable("rooms", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  hostelId: integer("hostel_id")
    .notNull()
    .references(() => hostels.id),
  roomNumber: text("room_number").notNull(),
  capacity: integer("capacity").notNull(),
  occupied: integer("occupied").notNull().default(0),
});

export const hostels = sqliteTable("hostels", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  location: text("location").notNull(),
  warden: text("wardern_name").notNull(),
  gender: text("gender", {
    enum: hostelGenderEnum,
  }).notNull(),

  createdAt: text("created_at").$type<string>().notNull(),
});

export const allocations = sqliteTable("allocations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  studentId: integer("student_id")
    .notNull()
    .references(() => students.id),
  roomId: integer("room_id")
    .notNull()
    .references(() => rooms.id),
  compatibilityScore: integer("compatibility_score"),
  explanation: text("explanation"),
  allocatedAt: text("allocated_at").$type<string>().notNull(),
});
// ... your existing table definitions

export const hostelsRelations = relations(hostels, ({ many }) => ({
  rooms: many(rooms),
}));

export const roomsRelations = relations(rooms, ({ one }) => ({
  hostel: one(hostels, {
    fields: [rooms.hostelId],
    references: [hostels.id],
  }),
}));
/** ===== INFERRED TYPES ===== */
export type Student = InferSelectModel<typeof students>;
export type NewStudent = InferInsertModel<typeof students>;

export type QuestionnaireResponseRow = InferSelectModel<
  typeof questionnaireResponses
>;
export type NewQuestionnaireResponse = InferInsertModel<
  typeof questionnaireResponses
>;

export type AITrait = InferSelectModel<typeof aiTraits>;
export type NewAITrait = InferInsertModel<typeof aiTraits>;

export type Room = InferSelectModel<typeof rooms>;
export type NewRoom = InferInsertModel<typeof rooms>;

export type Hostel = InferSelectModel<typeof hostels>;
export type NewHostel = InferInsertModel<typeof hostels>;

export type Allocation = InferSelectModel<typeof allocations>;
export type NewAllocation = InferInsertModel<typeof allocations>;
