import { createUser, getUserByEmail } from "@/server/services/userService";

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
