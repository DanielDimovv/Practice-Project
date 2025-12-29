import { loginUser } from "@/server/services/userService";

export async function POST(request: Request) {
  console.log(request);

  const body = await request.json();

  const { email, password } = body;

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
