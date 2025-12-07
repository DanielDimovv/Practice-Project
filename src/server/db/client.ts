import "server-only";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const dbPath = process.env.DB_FILE_PATH;
if (!dbPath) {
  throw new Error("DB_FILE_PATH environment variable is not set");
}

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
