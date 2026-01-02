import { createProject } from "@/server/services/projectService";
import { syncProjectAssignments } from "@/server/services/projectAssignmentService";
import { requireAuth } from "@/server/services/sessionService";

type CreateProjectBody = {
  name: string;
  description?: string;
  status: string;
  deadline: string;
  blockers?: string;
  userIds?: number[] | undefined;
};

export async function POST(request: Request) {
  // трябва ли да имам тип на json при положение че имам тип и проверявам local state който се изпраща насам

  try {
    const { user, error } = await requireAuth();

    if (error) {
      return Response.json({ error }, { status: 401 });
    }

    const body: CreateProjectBody = await request.json();

    const { name, description, status, deadline, blockers, userIds } = body;

    if (!name || !status || !deadline) {
      return Response.json(
        { error: "Name,status and deadline are required fields" },
        { status: 400 }
      );
    }

    const newProject = await createProject({
      name,
      description,
      status,
      deadline,
      blockers,
    });

    let projectAssignments;

    if (userIds && userIds.length > 0) {
      projectAssignments = await syncProjectAssignments(newProject.id, userIds);
    }

    return Response.json(
      {
        message: "Project created successfully",
        project: {
          id: newProject.id,
          name: newProject.name,
          description: newProject.description,
          status: newProject.status,
          deadline: newProject.deadline,
          blockers: newProject.blockers,
          assignments: projectAssignments,
        },
      },
      { status: 201 }
    );
  } catch {
    return Response.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
