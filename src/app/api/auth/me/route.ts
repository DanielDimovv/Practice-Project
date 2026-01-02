import { getUserBySessionId } from "@/server/services/sessionService";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (!sessionId) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await getUserBySessionId(sessionId);

  if (!user) {
    return Response.json(
      { error: "Session expired or invalid" },
      { status: 401 }
    );
  }

  return Response.json({ user }, { status: 200 });
}
