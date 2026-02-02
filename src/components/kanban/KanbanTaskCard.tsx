import { SelectTask, SelectUser } from "@/server/db/schema";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Label } from "@radix-ui/react-label";
import { Button } from "../ui/button";
import Link from "next/link";
import { useDraggable } from "@dnd-kit/core";
import ImageView from "../additional/ImageView";

interface KanbanTaskCardProps {
  task: SelectTask;
  users: SelectUser[];
  projectId: string;
}

export function getStatusColor(status: string) {
  switch (status) {
    case "planned":
      return "bg-gray-400 text-white";
    case "in_progress":
      return "bg-blue-500 text-white";
    case "blocked":
      return "bg-red-500 text-white";
    case "done":
      return "bg-green-500 text-white";
    default:
      return "";
  }
}

export default function KanbanTaskCard({
  task,
  users,
  projectId,
}: KanbanTaskCardProps) {
  const currentAssignedUser = users.find((u) => u.id === task.assignee_id);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="overflow-hidden cursor-grab active:cursor-grabbing"
    >
      <CardHeader>
      <div><ImageView type="task" id={task.id} /></div>
        <div className="flex justify-between items-start">
          
          <CardTitle>{task.name}</CardTitle>
          <Badge
            variant="outline"
            className={`${getStatusColor(task.status)} capitalize`}
          >
            {task.status.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 ">
        {task.description && (
          <>
            <Label>Description</Label>
            <p className="text-sm text-muted-foreground line-clamp-2 break-all h-10">
              {task.description}
            </p>
          </>
        )}

        {task.deadline && (
          <p className="text-sm">
            <span className="font-medium">Deadline: </span>
            {task.deadline}
          </p>
        )}
        {currentAssignedUser?.name ? (
          <div className="flex items-center gap-2">
            <Label>Assigned user:</Label>
            <div className="mt-2">
              <Badge variant="secondary" className="mb-2">
                {currentAssignedUser?.name}
              </Badge>
            </div>
          </div>
        ) : null}

        {task.blockers && task.status === "blocked" && (
          <>
            <Label>Blockers</Label>
            <p className="text-sm text-muted-foreground line-clamp-2 break-all h-10">
              {task.blockers}
            </p>
          </>
        )}
      </CardContent>

      <CardFooter>
        <Link href={`/project/${projectId}/task/${task.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            View more details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
