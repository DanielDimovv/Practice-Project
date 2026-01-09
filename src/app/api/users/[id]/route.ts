import { deleteUser, updateUser } from "@/server/services/userService";
import { requireAuth } from "@/server/services/sessionService";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireAuth();

  if (error || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const targetUserId = Number(id);

  const { role } = await request.json();

  if (role !== "admin" && role !== "user") {
    return Response.json({ error: "Invalid role" }, { status: 400 });
  }

  const updatedUser = await updateUser(targetUserId, { role });

  if (!updatedUser) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  return Response.json(
    {
      message: "User role updated",
      user: updatedUser,
    },
    { status: 200 }
  );
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireAuth();

  if (error || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const targetUserId = Number(id);

  if (user.id === targetUserId) {
    return Response.json({ error: "Cannot delete yourself" }, { status: 400 });
  }

  const deleted = await deleteUser(targetUserId);

  if (!deleted) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  return Response.json({ message: "User deleted" }, { status: 200 });
}
