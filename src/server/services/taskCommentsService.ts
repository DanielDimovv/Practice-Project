import { db } from "../db/client";

import {
  usersTable,
  taskComments,
  projectTasks,
  SelectTaskComment,
  InsertTaskComment,
} from "../db/schema";

import { eq } from "drizzle-orm";

export async function createComment(
  data: InsertTaskComment
): Promise<SelectTaskComment> {
  const [createdComment] = await db
    .insert(taskComments)
    .values(data)
    .returning();

  return createdComment;
}

export async function editComment(
  commentId: number,
  content: string
): Promise<SelectTaskComment | undefined> {
  const [updatedComment] = await db
    .update(taskComments)
    .set({ content })
    .where(eq(taskComments.id, commentId))
    .returning();

  return updatedComment;
}

export async function deleteComment(commentId: number): Promise<boolean> {
  const [deletedComment] = await db
    .delete(taskComments)
    .where(eq(taskComments.id, commentId))
    .returning();

  return deletedComment !== undefined;
}

type CommentWithUser = {
  id: number;
  content: string;
  createdAt: number;
  userId: number;
  userName: string;
  userRole: string;
};

export async function getAllCommentsByTaskId(
  taskId: string
): Promise<CommentWithUser[]> {
  const comments = await db
    .select({
      id: taskComments.id,
      content: taskComments.content,
      createdAt: taskComments.created_at,
      userId: taskComments.user_id,
      userName: usersTable.name,
      userRole: usersTable.role,
    })
    .from(taskComments)
    .innerJoin(usersTable, eq(taskComments.user_id, usersTable.id))
    .where(eq(taskComments.task_id, taskId))
    .orderBy(taskComments.created_at);

  return comments;
}

export async function getCommentById(
  commentId: number
): Promise<SelectTaskComment | undefined> {
  const [comment] = await db
    .select()
    .from(taskComments)
    .where(eq(taskComments.id, commentId));

  return comment;
}
