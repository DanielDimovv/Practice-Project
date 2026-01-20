"use client";
import EditProjectCard from "@/components/projectCards/EditProjectCard";
import { useGetProjectByID, useUpdateProject } from "@/hooks/project";
import { useParams } from "next/navigation";
import { useGetAssignedUsersToProject } from "@/hooks/user";

import { useGetProjectTasks } from "@/hooks/task";

import { useCurrentUser } from "@/hooks/useAuth";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import TaskStatisticsCard from "@/components/TaskStatisticsCard";
import { useState } from "react";
import ViewEditProjectCard from "@/components/projectCards/ViewEditProjectCard";

export default function ProjectPage() {
  const { id } = useParams();
  const { data: user } = useCurrentUser();
  const isAdmin = user?.role === "admin";
  const [isEditingProject, setIsEditingProject] = useState(false);

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
  const tasks = projectTasks?.projectTasks ?? [];

  if (projectLoading || loadingUsers) {
    return <p>Loading project...</p>;
  }

  if (projectError || !projectData) {
    return <p>Error loading project</p>;
  }

  return (
    <div className="space-y-6">
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-3">
        {isEditingProject ? (
          <EditProjectCard
            projectID={id as string}
            projectData={projectData.project}
            errorProject={projectError}
            assignedUsers={assignedUsers}
            isPendingProject={isPendingProject}
            onSubmit={updateProject}
            isAdmin={isAdmin}
            setIsEditing={setIsEditingProject}
          />
        ) : (
          <ViewEditProjectCard
            projectData={projectData.project}
            projectId={id as string}
            setIsEditing={setIsEditingProject}
            isAdmin={isAdmin}
            userName={user.name}
            assignedUsers={assignedUsers}
          />
        )}

        <TaskStatisticsCard tasks={tasks} />
      </div>

      <div className="border-t">
        <h2 className="text-xl font-semibold mb-4">Tasks</h2>

        <div>
          {loadingTasks && <p>Loading tasks...</p>}
          <KanbanBoard
            users={assignedUsers}
            projectId={id as string}
            projectTasks={tasks}
          />
        </div>
      </div>
    </div>
  );
}
