import {
  getProjectById,
  updateProject,
  deleteProject,
} from "@/server/services/projectService";
import { syncProjectAssignments } from "@/server/services/projectAssignmentService";
import { requireAuth } from "@/server/services/sessionService";
import { createProjectImageJunction , getImageByProjectId,deleteProjectImage} from "@/server/services/imageServices";

export type UpdateProject = {
  name?: string;
  description?: string;
  status?: string;
  deadline?: string;
  blockers?: string;
  userIds?: number[];
  imageId?:number
};

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
    const { user, error } = await requireAuth();

    if (error) {
      return Response.json({ error }, { status: 401 });
    }

    const { id } = await params;
    const body: UpdateProject = await request.json();
    const { userIds, ...projectData } = body;

    const updatedProject = await updateProject(id, projectData);

    let imageToProject 

  if (projectData.imageId) {
    
    const existingImage = await getImageByProjectId(id);
    
    
    if (existingImage) {
      await deleteProjectImage(existingImage.id);
    }
    
   
    imageToProject = await createProjectImageJunction(id, projectData.imageId);
  }


    const updatedAssignments = await syncProjectAssignments(id, userIds ?? []);

    return Response.json(
      {
        updatedProject: updatedProject,
        updatedAssignments: updatedAssignments,
        imageToProject: imageToProject
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
    const { user, error } = await requireAuth();

    if (error) {
      return Response.json({ error }, { status: 401 });
    }

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
