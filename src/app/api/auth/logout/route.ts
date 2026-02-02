import {
  deleteSession,
  cleanupExpiredSessions,
  getUserBySessionId,
} from "@/server/services/sessionService";
import { createActivity } from "@/server/services/trackActivity";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  const sessionId = cookieStore.get("session_id")?.value;

  if (sessionId) {
    const user = await getUserBySessionId(sessionId)
    await cleanupExpiredSessions();
    await deleteSession(sessionId);

    if (user) {
      try {
        await createActivity({ user_id: user.id, operation: "logout" });
      } catch (error) {
        console.error("Failed to log activity:", error);
      }
    }

  cookieStore.delete("session_id");

  return Response.json({ message: "Logged out successfully" }, { status: 200 });
} }
