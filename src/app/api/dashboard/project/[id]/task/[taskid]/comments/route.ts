import {
  getAllCommentsByTaskId,
  createComment,
  getCommentById,
} from "@/server/services/taskCommentsService";
import { getTaskById } from "@/server/services/taskService";
import { requireAuth } from "@/server/services/sessionService";
import { createCommentImageJunction, deleteCommentImage, getImageByCommentId } from "@/server/services/imageServices";
import { commentImagesCross } from "@/server/db/schema";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ taskid: string }> }
) {
  try {
    const { user, error } = await requireAuth();

    if (error) {
      return Response.json({ error }, { status: 401 });
    }

    const { taskid } = await params;

    const task = await getTaskById(taskid);
    if (!task) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    const taskComments = await getAllCommentsByTaskId(taskid);

    return Response.json({ taskComments }, { status: 200 });
  } catch {
    return Response.json(
      { error: "Failed to fetch tasks comments" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ taskid: string }> }
) {
  try {
    const { user, error } = await requireAuth();

    if (error) {
      return Response.json({ error }, { status: 401 });
    }

    const { taskid } = await params;
    const { content,imageId } = await request.json();

    if (!content || typeof content !== "string" || content.trim() === "") {
      return Response.json({ error: "Content is required" }, { status: 400 });
    }

    const createdComment = await createComment({
      task_id: taskid,
      user_id: user!.id,
      content: content.trim(),
    });

    let imageToComment = null;

   
    if (imageId) {
      imageToComment = await createCommentImageJunction(createdComment.id, imageId);
    }
    const imageUrl = imageId ? await getImageByCommentId(createdComment.id) : null;

    return Response.json({ comment: createdComment, image:imageToComment, imageUrl: imageUrl?.url }, { status: 201 });
  } catch {
    return Response.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
