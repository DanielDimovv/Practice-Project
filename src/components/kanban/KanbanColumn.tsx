import { SelectTask, SelectUser, TaskStatus } from "@/server/db/schema";
import KanbanTaskCard from "./KanbanTaskCard";
import { useDroppable } from "@dnd-kit/core";

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: SelectTask[];
  users: SelectUser[];
  projectId: string;
}

export default function KanbanColumn({
  status,
  tasks,
  users,
  projectId,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className={` p-4 rounded-lg
      ${isOver ? "bg-blue-100" : "bg-gray-100"}
    `}
    >
      <h3 className="font-bold text-lg mb-4 capitalize">
        {status.replace("_", " ")}
      </h3>
      <div className=" space-y-3">
        {tasks?.map((task) => (
          <KanbanTaskCard
            key={task.id}
            users={users}
            projectId={projectId}
            task={task}
          />
        ))}
      </div>
    </div>
  );
}
