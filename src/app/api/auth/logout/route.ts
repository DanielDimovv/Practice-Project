import {
  deleteSession,
  cleanupExpiredSessions,
} from "@/server/services/sessionService";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  const sessionId = cookieStore.get("session_id")?.value;

  if (sessionId) {
    await cleanupExpiredSessions();
    await deleteSession(sessionId);
  }

  cookieStore.delete("session_id");

  return Response.json({ message: "Logged out successfully" }, { status: 200 });
}
