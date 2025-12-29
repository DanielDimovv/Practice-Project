import { getUsersByProjectID } from "@/server/services/projectAssignmentService";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const assignedUsers = await getUsersByProjectID(id);

    return Response.json({ users: assignedUsers }, { status: 200 });
  } catch {
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
