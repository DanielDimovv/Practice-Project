import { SelectTask, SelectUser, TaskStatus } from "@/server/db/schema";
import {
  DndContext,
  DragEndEvent,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import KanbanColumn from "./KanbanColumn";
import { useUpdateTaskStatus } from "@/hooks/task";

interface KanbanBoardProps {
  projectTasks: SelectTask[];
  projectId: string;
  users: SelectUser[];
}

export default function KanbanBoard({
  projectTasks,
  projectId,
  users,
}: KanbanBoardProps) {
  const { mutate: updateTaskStatus } = useUpdateTaskStatus(projectId);

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  const COLUMNS: TaskStatus[] = ["planned", "in_progress", "blocked", "done"];

  const tasksByStatus = {
    planned: projectTasks.filter((task) => task.status === "planned"),
    in_progress: projectTasks.filter((task) => task.status === "in_progress"),
    blocked: projectTasks.filter((task) => task.status === "blocked"),
    done: projectTasks.filter((task) => task.status === "done"),
  };

  function HandleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    const task = projectTasks.find((t) => t.id === taskId);

    if (!task) return;

    if (task.status === newStatus) return;

    updateTaskStatus({ taskId: taskId, status: newStatus });
  }
  return (
    <DndContext sensors={sensors} onDragEnd={HandleDragEnd}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((status) => (
          <KanbanColumn
            users={users}
            key={status}
            status={status}
            tasks={tasksByStatus[status]}
            projectId={projectId}
          />
        ))}
      </div>
    </DndContext>
  );
}
