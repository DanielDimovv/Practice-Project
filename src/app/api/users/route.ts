import { getAllUsers } from "@/server/services/userService";

export async function GET() {
  try {
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
