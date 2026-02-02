import { createUser, getAllUsers, getUserByEmail } from "@/server/services/userService";
import { requireAuth } from "@/server/services/sessionService";

export async function GET() {
  try {
    const { user, error } = await requireAuth();

    if (error) {
      return Response.json({ error }, { status: 401 });
    }
    const allUsers = await getAllUsers();

    return Response.json(
      {
        message: "Array of all users",
        users: allUsers,
      },
      { status: 200 }
    );
  } catch {
    return Response.json(
      {
        error: "Failed to fetch users",
      },
      { status: 500 }
    );
  }
}


export async function POST(request:Request) {
  try {

    const {user,error} = await requireAuth()

    if (error) {
      return Response.json({ error }, { status: 401 });
    }

    const {name, email, password, role} = await request.json()

    if (!name || !email || !password) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }

    const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return Response.json({ error: "The email already exist" }, { status: 409 });
  }
 
  const newUser = await createUser({name,email,password,role})

  return Response.json({
    message: "User created successfully",
    user: {
      id:newUser.id,
      name:newUser.name,
      email:newUser.email,
      role:newUser.role

    }
  }, {status:201})




  } catch (error) {
    console.error("Error creating user:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

