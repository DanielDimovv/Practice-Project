import { db } from "../db/client";
import {
  projectAssignments,
  InsertProjectAssignments,
  SelectProjectAssignments,
} from "../db/schema";
import { eq } from "drizzle-orm";

export async function assignUserToProject(
  projectId: string,
  userId: number
): Promise<SelectProjectAssignments> {
  const [assignedProject] = await db
    .insert(projectAssignments)
    .values({ project_id: projectId, user_id: userId })
    .returning();

  return assignedProject;
}
