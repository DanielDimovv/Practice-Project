import { getProjectsForUser } from "@/server/services/projectService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const userRole = searchParams.get("role");

  if (!userId || !userRole) {
    return Response.json({ error: "Missing userId or role" }, { status: 400 });
  }

  const projects = await getProjectsForUser(Number(userId), userRole);

  return Response.json(
    {
      message: "Projects of the current user",
      projects,
    },
    { status: 200 }
  );
}
