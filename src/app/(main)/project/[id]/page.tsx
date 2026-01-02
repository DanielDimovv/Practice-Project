"use client";
import EditProjectCard from "@/components/projectCards/EditProjectCard";
import { useGetProjectByID, useUpdateProject } from "@/hooks/project";
import { useParams } from "next/navigation";
import { useGetAssignedUsersToProject } from "@/hooks/user";
import { SelectUser, SelectTask } from "@/server/db/schema";
import { useGetProjectTasks } from "@/hooks/task";
import TaskCard from "@/components/projectCards/TaskCard";
import { useCurrentUser } from "@/hooks/useAuth";

export default function ProjectPage() {
  const { id } = useParams();
  const { data: user } = useCurrentUser();
  const isAdmin = user?.role === "admin";

  const {
    data: projectData,
    isLoading: projectLoading,
    error: projectError,
  } = useGetProjectByID(id as string);

  const { mutate: updateProject, isPending: isPendingProject } =
    useUpdateProject(id as string);

  const { data: assignedUsersToTheProject, isLoading: loadingUsers } =
    useGetAssignedUsersToProject(id as string);

  const assignedUsers = assignedUsersToTheProject?.users ?? [];

  const { data: projectTasks, isLoading: loadingTasks } = useGetProjectTasks(
    id as string
  );

  if (projectLoading || loadingUsers) {
    return <p>Loading project...</p>;
  }

  if (projectError || !projectData) {
    return <p>Error loading project</p>;
  }

  return (
    <div className="space-y-6">
      <EditProjectCard
        projectID={id as string}
        projectData={projectData.project}
        errorProject={projectError}
        assignedUsers={assignedUsers}
        isPendingProject={isPendingProject}
        onSubmit={updateProject}
        isAdmin={isAdmin}
      />
      <div className="border-t">
        <h2 className="text-xl font-semibold mb-4">Tasks</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loadingTasks && <p>Loading tasks...</p>}
          {!loadingTasks && projectTasks?.projectTasks?.length === 0 && (
            <p>No tasks yet</p>
          )}
          {!loadingTasks &&
            projectTasks?.projectTasks?.map((task: SelectTask) => (
              <TaskCard
                key={task.id}
                task={task}
                projectId={id as string}
                isAdmin={isAdmin}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
