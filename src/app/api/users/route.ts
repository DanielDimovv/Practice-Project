import { getAllUsers } from "@/server/services/userService";
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
