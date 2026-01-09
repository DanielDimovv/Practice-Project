"use client";

import { useParams } from "next/navigation";
import { useGetTaskById } from "@/hooks/task";
import CommentsSection from "@/components/comments/CommentsSection";

export default function TaskPage() {
  const { id, taskId } = useParams();
  const projectId = id as string;
  const taskIdStr = taskId as string;

  const {
    data: taskData,
    isLoading: loadingTask,
    error: errorTask,
  } = useGetTaskById(projectId, taskIdStr);

  if (loadingTask) return <p>Loading task...</p>;
  if (errorTask) return <p>Error loading task</p>;

  return (
    <>
      <CommentsSection taskId={taskIdStr} projectId={projectId} />
    </>
  );
}
