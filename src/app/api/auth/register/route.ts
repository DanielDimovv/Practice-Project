import { createUser, getUserByEmail } from "@/server/services/userService";
import {
  createSession,
  SESSION_DURATION,
} from "@/server/services/sessionService";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const body = await request.json();

  const { name, email, password } = body;

  if (!name || !email || !password) {
    return Response.json({ error: "All fields are required" }, { status: 400 });
  }

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return Response.json({ error: "The email already exist" }, { status: 409 });
  }

  const newUser = await createUser({ name, email, password });

  const session = await createSession(newUser.id);

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
      message: "User created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    },
    { status: 201 }
  );
}
