"use client";

import { useParams } from "next/navigation";
import { useGetTaskById } from "@/hooks/task";
import CommentsSection from "@/components/comments/CommentsSection";
import TaskCard from "@/components/projectCards/TaskCard";
import { useCurrentUser } from "@/hooks/useAuth";

export default function TaskPage() {
  const { id, taskId } = useParams();
  const projectId = id as string;
  const taskIdStr = taskId as string;

  const { data: user } = useCurrentUser();
  const isAdmin = user?.role === "admin";

  const {
    data: taskData,
    isLoading: loadingTask,
    error: errorTask,
  } = useGetTaskById(projectId, taskIdStr);

  if (loadingTask) return <p>Loading task...</p>;
  if (errorTask) return <p>Error loading task</p>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        <div>
          {loadingTask && <p>Loading tasks...</p>}
          {errorTask && <p>Error loading task</p>}
          <TaskCard
            task={taskData?.task}
            projectId={projectId}
            isAdmin={isAdmin}
          />
        </div>
        <div>
          <CommentsSection taskId={taskIdStr} projectId={projectId} />
        </div>
      </div>
    </>
  );
}
