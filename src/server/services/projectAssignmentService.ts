import { db } from "../db/client";
import {
  projectAssignments,
  projectsTable,
  usersTable,
  SelectUser,
  SelectProject,
  SelectProjectAssignments,
} from "../db/schema";
import { eq, inArray, and } from "drizzle-orm";

export async function getUserProjects(
  userId: number
): Promise<SelectProject[]> {
  const projects = await db
    .select({
      id: projectsTable.id,
      name: projectsTable.name,
      description: projectsTable.description,
      status: projectsTable.status,
      deadline: projectsTable.deadline,
      blockers: projectsTable.blockers,
    })
    .from(projectAssignments)
    .innerJoin(
      projectsTable,
      eq(projectAssignments.project_id, projectsTable.id)
    )
    .where(eq(projectAssignments.user_id, userId));

  return projects;
}

export async function getUsersByProjectID(
  projectID: string
): Promise<Omit<SelectUser, "password">[]> {
  const usersOfProject = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      role: usersTable.role,
    })
    .from(projectAssignments)
    .innerJoin(usersTable, eq(projectAssignments.user_id, usersTable.id))
    .where(eq(projectAssignments.project_id, projectID));

  return usersOfProject;
}

export async function syncProjectAssignments(
  projectId: string,
  newUserIDs: number[]
): Promise<SelectProjectAssignments[]> {
  const currentAssignedUsers = await db
    .select({ userId: projectAssignments.user_id })
    .from(projectAssignments)
    .where(eq(projectAssignments.project_id, projectId));

  const currentUserIDs = currentAssignedUsers.map((user) => user.userId);

  const toAdd = newUserIDs.filter((id) => !currentUserIDs.includes(id));
  const toRemove = currentUserIDs.filter((id) => !newUserIDs.includes(id));

  if (toRemove.length > 0) {
    await db
      .delete(projectAssignments)
      .where(
        and(
          eq(projectAssignments.project_id, projectId),
          inArray(projectAssignments.user_id, toRemove)
        )
      );
  }

  if (toAdd.length > 0) {
    await db.insert(projectAssignments).values(
      toAdd.map((userId) => ({
        project_id: projectId,
        user_id: userId,
      }))
    );
  }

  const currentAssignments = await db
    .select()
    .from(projectAssignments)
    .where(eq(projectAssignments.project_id, projectId));

  return currentAssignments;
}
