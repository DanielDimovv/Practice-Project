import {
  getCommentById,
  editComment,
  deleteComment,
} from "@/server/services/taskCommentsService";
import { requireAuth } from "@/server/services/sessionService";
import { createCommentImageJunction, deleteCommentImage, getImageByCommentId } from "@/server/services/imageServices";


export async function GET(
  _request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { error } = await requireAuth();

    if (error) {
      return Response.json({ error }, { status: 401 });
    }

    const { commentId } = await params;

    const comment = await getCommentById(Number(commentId));

    if (!comment) {
      return Response.json({ error: "Comment not found" }, { status: 404 });
    }

    return Response.json({ comment }, { status: 200 });
  } catch {
    return Response.json({ error: "Failed to fetch comment" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { user, error } = await requireAuth();

    if (error) {
      return Response.json({ error }, { status: 401 });
    }

    const { commentId } = await params;
    const { content,imageId } = await request.json();

    if (!content || typeof content !== "string" || content.trim() === "") {
      return Response.json({ error: "Content is required" }, { status: 400 });
    }

    const existingComment = await getCommentById(Number(commentId));

    if (!existingComment) {
      return Response.json({ error: "Comment not found" }, { status: 404 });
    }

    if (existingComment.user_id !== user!.id) {
      return Response.json(
        { error: "You can only edit your own comments" },
        { status: 403 }
      );
    }

    const updatedComment = await editComment(Number(commentId), content.trim());

    let imageToComment 

if (imageId) {
  const existingImage = await getImageByCommentId(Number(commentId));
  
  if (existingImage) {
    await deleteCommentImage(existingImage.id);
  }
  
  imageToComment = await createCommentImageJunction(Number(commentId), imageId);
}

    return Response.json({ comment: updatedComment, image:imageToComment }, { status: 200 });
  } catch {
    return Response.json(
      { error: "Failed to update comment" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { user, error } = await requireAuth();

    if (error) {
      return Response.json({ error }, { status: 401 });
    }

    const { commentId } = await params;

    const existingComment = await getCommentById(Number(commentId));

    if (!existingComment) {
      return Response.json({ error: "Comment not found" }, { status: 404 });
    }

    if (existingComment.user_id !== user!.id) {
      return Response.json(
        { error: "You can only delete your own comments" },
        { status: 403 }
      );
    }

    await deleteComment(Number(commentId));

    return Response.json({ success: true }, { status: 200 });
  } catch {
    return Response.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
