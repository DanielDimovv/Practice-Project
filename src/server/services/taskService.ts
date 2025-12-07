import { db } from "../db/client";
import { projectTasks, SelectTask, InsertTask } from "../db/schema";
import { eq } from "drizzle-orm";

export async function createTask(data: InsertTask): Promise<SelectTask> {
  const [createdTask] = await db.insert(projectTasks).values(data).returning();
  return createdTask;
}

export async function getTaskById(id: string): Promise<SelectTask | undefined> {
  const [task] = await db
    .select()
    .from(projectTasks)
    .where(eq(projectTasks.id, id));
  return task;
}

export async function getProjectTasks(
  projectId: string
): Promise<SelectTask[]> {
  const projectTasksArray = await db
    .select()
    .from(projectTasks)
    .where(eq(projectTasks.project_id, projectId));
  return projectTasksArray;
}

export async function updateTask(
  id: string,
  data: Partial<InsertTask>
): Promise<SelectTask | undefined> {
  const [updatedTask] = await db
    .update(projectTasks)
    .set(data)
    .where(eq(projectTasks.id, id))
    .returning();

  return updatedTask;
}

export async function deleteTask(taskId: string): Promise<boolean> {
  const [deletedTask] = await db
    .delete(projectTasks)
    .where(eq(projectTasks.id, taskId))
    .returning();

  return deletedTask !== undefined;
}
