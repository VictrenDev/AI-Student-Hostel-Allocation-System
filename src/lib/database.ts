import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
// 1. Import your schema (where your tables and relations are defined)
import * as schema from "./schema";

const sqlite = new Database("hostel.db");

// 2. Pass the schema as the second argument
export const db = drizzle(sqlite, { schema });
