import {
  getProjectById,
  updateProject,
  deleteProject,
} from "@/server/services/projectService";
import { syncProjectAssignments } from "@/server/services/projectAssignmentService";

export type UpdateProject = {
  name?: string;
  description?: string;
  status?: string;
  deadline?: string;
  blockers?: string;
  userIds?: number[];
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const currentProject = await getProjectById(id);

    if (!currentProject) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }

    return Response.json({ project: currentProject }, { status: 200 });
  } catch {
    return Response.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: UpdateProject = await request.json();
    const { userIds, ...projectData } = body;

    const updatedProject = await updateProject(id, projectData);

    const updatedAssignments = await syncProjectAssignments(id, userIds ?? []);

    return Response.json(
      {
        updatedProject: updatedProject,
        updatedAssignments: updatedAssignments,
      },
      { status: 200 }
    );
  } catch {
    return Response.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await deleteProject(id);

    return Response.json(
      { message: "Successfully deleted project" },
      { status: 200 }
    );
  } catch {
    return Response.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
