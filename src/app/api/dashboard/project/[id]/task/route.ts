import { createTask, getProjectTasks } from "@/server/services/taskService";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
    const { id } = await params;

    const { name, status, deadline, assignee_id, blockers, description } =
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

    return Response.json({ task: newTask }, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create task" }, { status: 500 });
  }
}
