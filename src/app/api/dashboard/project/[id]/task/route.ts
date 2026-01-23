import { createTask, getProjectTasks } from "@/server/services/taskService";
import { requireAuth } from "@/server/services/sessionService";
import { createTaskImageJunction } from "@/server/services/imageServices";

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

    const projectTasks = await getProjectTasks(id);

    return Response.json({ projectTasks }, { status: 200 });
  } catch {
    return Response.json(
      { error: "Failed to fetch project tasks" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireAuth();

    if (error) {
      return Response.json({ error }, { status: 401 });
    }
    const { id } = await params;

    const { name, status, deadline, assignee_id, blockers, description, imageId } =
      await request.json();

    const newTask = await createTask({
      project_id: id,
      name,
      status,
      deadline,
      assignee_id,
      blockers,
      description,
    });

    let imageRef

    if (imageId) 
      imageRef = await createTaskImageJunction(newTask.id,imageId)

    return Response.json({ task: newTask, imageRef}, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create task" }, { status: 500 });
  }
}
