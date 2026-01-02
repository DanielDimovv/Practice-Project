import { loginUser } from "@/server/services/userService";
import {
  createSession,
  SESSION_DURATION,
} from "@/server/services/sessionService";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  console.log(request);

  const body = await request.json();

  const { email, password,} = body;

  if (!email || !password) {
    return Response.json(
      { error: "Missing required field, enter your email and password" },
      { status: 400 }
    );
  }

  const user = await loginUser(email, password);

  if (!user) {
    return Response.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const session = await createSession(user.id);
  const cookieStore = await cookies();
  cookieStore.set("session_id", session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  });

  return Response.json(
    {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    },
    { status: 200 }
  );
}
