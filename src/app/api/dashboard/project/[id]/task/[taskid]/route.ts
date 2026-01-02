import { deleteTask, updateTask } from "@/server/services/taskService";
import { requireAuth } from "@/server/services/sessionService";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ taskid: string }> }
) {
  try {
    const { user, error } = await requireAuth();

    if (error) {
      return Response.json({ error }, { status: 401 });
    }

    const { taskid } = await params;

    const { name, description, status, deadline, blockers, assignee_id } =
      await request.json();

    const updatedTask = await updateTask(taskid, {
      name,
      description,
      status,
      deadline,
      blockers,
      assignee_id,
    });

    if (!updatedTask) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    return Response.json({ task: updatedTask }, { status: 200 });
  } catch {
    return Response.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ taskid: string }> }
) {
  try {
    const { user, error } = await requireAuth();

    if (error) {
      return Response.json({ error }, { status: 401 });
    }

    const { taskid } = await params;
    const deletedTask = await deleteTask(taskid);

    if (!deletedTask) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    return Response.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch {
    return Response.json(
      { error: "Failed to delete the task" },
      { status: 500 }
    );
  }
}
