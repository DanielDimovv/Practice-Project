import { getProjectsForUser } from "@/server/services/projectService";
import { requireAuth } from "@/server/services/sessionService";

export async function GET() {
  const { user, error } = await requireAuth();

  if (error || !user) {
    return Response.json({ error }, { status: 401 });
  }

  const projects = await getProjectsForUser(user.id, user.role);

  return Response.json(
    {
      message: "Projects of the current user",
      projects,
    },
    { status: 200 }
  );
}
