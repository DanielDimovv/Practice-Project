import { db } from "../db/client";
import { cookies } from "next/headers";

import {
  sessionsTable,
  InsertSession,
  SelectSession,
  SelectUser,
  usersTable,
} from "../db/schema";
import { eq, and, gt, lt } from "drizzle-orm";

export const SESSION_DURATION = 60 * 60;

export async function createSession(userId: number): Promise<SelectSession> {
  const expireAt = Math.floor(Date.now() / 1000) + SESSION_DURATION;

  const [session] = await db
    .insert(sessionsTable)
    .values({ user_id: userId, expires_at: expireAt })
    .returning();

  return session;
}

export async function getSessionById(
  sessionId: string
): Promise<SelectSession | undefined> {
  const [session] = await db
    .select()
    .from(sessionsTable)
    .where(eq(sessionsTable.id, sessionId));

  return session;
}

export async function getUserBySessionId(
  sessionId: string
): Promise<Omit<SelectUser, "password"> | undefined> {
  const [user] = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      role: usersTable.role,
    })
    .from(sessionsTable)
    .innerJoin(usersTable, eq(sessionsTable.user_id, usersTable.id))
    .where(
      and(
        eq(sessionsTable.id, sessionId),
        gt(sessionsTable.expires_at, Math.floor(Date.now() / 1000))
      )
    );

  return user;
}

export async function deleteSession(sessionId: string): Promise<boolean> {
  const [deletedSession] = await db
    .delete(sessionsTable)
    .where(eq(sessionsTable.id, sessionId))
    .returning();

  return deletedSession !== undefined;
}

export async function requireAuth() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;
  if (!sessionId) {
    return { user: null, error: "Not authenticated" };
  }
  const user = await getUserBySessionId(sessionId);
  if (!user) {
    return { user: null, error: "Session expired or invalid" };
  }
  return { user, error: null };
}

export async function cleanupExpiredSessions() {
  const now = Math.floor(Date.now() / 1000);

  await db.delete(sessionsTable).where(lt(sessionsTable.expires_at, now));
}
