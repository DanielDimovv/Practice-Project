import { db } from "../db/client";
import { projectsTable, SelectProject, InsertProject } from "../db/schema";
import { eq } from "drizzle-orm";

export async function createProject(
  data: InsertProject
): Promise<SelectProject> {
  const [createdProject] = await db
    .insert(projectsTable)
    .values(data)
    .returning();
  return createdProject;
}

export async function getProjectById(
  id: string
): Promise<SelectProject | undefined> {
  const [projectByID] = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.id, id));
  return projectByID;
}

export async function getAllProjects(): Promise<SelectProject[]> {
  const projects = await db.select().from(projectsTable);
  return projects;
}

export async function updateProject(
  id: string,
  data: Partial<InsertProject>
): Promise<SelectProject | undefined> {
  const [updatedProject] = await db
    .update(projectsTable)
    .set(data)
    .where(eq(projectsTable.id, id))
    .returning();

  return updatedProject;
}

export async function deleteProject(id: string): Promise<boolean> {
  const [deletedProject] = await db
    .delete(projectsTable)
    .where(eq(projectsTable.id, id))
    .returning();

  return deletedProject !== undefined;
}
