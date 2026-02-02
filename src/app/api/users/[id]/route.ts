import { deleteUser, updateUser } from "@/server/services/userService";
import { requireAuth } from "@/server/services/sessionService";
import bcrypt from "bcrypt";


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

  const { name, email, password, role } = await request.json();

  console.log(role)

  if (role !== "admin" && role !== "user") {
    return Response.json({ error: "Invalid role" }, { status: 400 });
  }

  const updateData: {
    name: string;
    email: string;
    password?: string;
    role: "admin" | "user";
  } = {
    name,
    email,
    role,
  };

  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await updateUser(targetUserId, updateData);

  if (!updatedUser) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  return Response.json(
    {
      message: "User updated",
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
