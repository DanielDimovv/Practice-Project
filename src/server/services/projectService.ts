import { db } from "../db/client";
import {
  projectsTable,
  SelectProject,
  InsertProject,
  projectAssignments,
} from "../db/schema";
import { eq, inArray } from "drizzle-orm";

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

export async function getUserProjects(userID: number) {
  const userProjectIDs = await db
    .select({ project_id: projectAssignments.project_id })
    .from(projectAssignments)
    .where(eq(projectAssignments.user_id, userID));

  const projectIds = userProjectIDs.map((row) => row.project_id);
  const projects = await db
    .select()
    .from(projectsTable)
    .where(inArray(projectsTable.id, projectIds));

  return projects;
}

// const projects = await db
//   .select({
//     id: projectsTable.id,
//     name: projectsTable.name,
//     description: projectsTable.description,
//     status: projectsTable.status,
//     deadline: projectsTable.deadline,
//     blockers: projectsTable.blockers,
//   })
//   .from(projectAssignments)
//   .innerJoin(projectsTable, eq(projectAssignments.project_id, projectsTable.id))
//   .where(eq(projectAssignments.user_id, userID));

// return projects;

export async function getAllProjects(): Promise<SelectProject[]> {
  const projects = await db.select().from(projectsTable);
  return projects;
}

export async function getProjectsForUser(userId: number, role: string) {
  if (role === "admin") {
    return getAllProjects();
  }

  return getUserProjects(userId);
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
