import {getTaskById, deleteTask, updateTask } from "@/server/services/taskService";
import { requireAuth } from "@/server/services/sessionService";
import { createTaskImageJunction, deleteTaskImage, getImageByTaskId } from "@/server/services/imageServices";


export async function GET(
  _request: Request,
  { params }: { params: Promise<{ taskid: string }> }
) {
  try {
    const { error } = await requireAuth();

    if (error) {
      return Response.json({ error }, { status: 401 });
    }

    const { taskid } = await params;
    const task = await getTaskById(taskid);

    if (!task) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    return Response.json({ task }, { status: 200 });
  } catch {
    return Response.json({ error: "Failed to fetch task" }, { status: 500 });
  }
}

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

    const { name, description, status, deadline, blockers, assignee_id, imageId } =
      await request.json();

    const updatedTask = await updateTask(taskid, {
      name,
      description,
      status,
      deadline,
      blockers,
      assignee_id,
    });

    let imageToTask

    if (imageId) {
      const existingImage = await getImageByTaskId(taskid)

      if (existingImage) {
        await deleteTaskImage(existingImage.id)
      }

      imageToTask = await createTaskImageJunction(taskid,imageId)
    }

    

    if (!updatedTask) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    return Response.json({ task: updatedTask, image:imageToTask }, { status: 200 });
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
