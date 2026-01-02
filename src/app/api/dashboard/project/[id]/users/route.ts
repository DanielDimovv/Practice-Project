import { getUsersByProjectID } from "@/server/services/projectAssignmentService";
import { requireAuth } from "@/server/services/sessionService";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireAuth();

    if (error) {
      return Response.json({ error }, { status: 401 });
    }

    const { id } = await params;
    const assignedUsers = await getUsersByProjectID(id);

    return Response.json({ users: assignedUsers }, { status: 200 });
  } catch {
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
