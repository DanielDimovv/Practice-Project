"use client";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "../ui/select";
import { SheetHeader, SheetClose, SheetTitle } from "../ui/sheet";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useGetAssignedUsersToProject } from "@/hooks/user";
import { SelectUser } from "@/server/db/schema";
import { Button } from "../ui/button";
import { useCreateTask } from "@/hooks/task";

type Props = {
  projectId: string;
  onSuccess: () => void;
  isAdmin: boolean;
};

type Task = {
  name: string;
  description?: string;
  status: string;
  deadline: string;
  blockers?: string;
  assigneeId: number | null;
};
export default function CreateTaskCard({
  projectId,
  onSuccess,
  isAdmin,
}: Props) {
  const { data: assignedUsers, isLoading: loadingUsers } =
    useGetAssignedUsersToProject(projectId);
  const {
    mutate: createTask,
    isPending: pendingCreation,
    error: createTaskEroor,
  } = useCreateTask(projectId);
  const [taskData, setTaskData] = useState<Task>({
    name: "",
    description: "",
    status: "planned",
    deadline: "",
    blockers: "",
    assigneeId: null,
  });

  return (
    <>
      <SheetHeader>
        <SheetTitle>Create New Task</SheetTitle>
      </SheetHeader>
      <form
        className="space-y-4 mt-4"
        onSubmit={(e) => {
          e.preventDefault();
          createTask(
            {
              name: taskData.name,
              description: taskData.description,
              status: taskData.status,
              deadline: taskData.deadline,
              blockers: taskData.blockers,
              assignee_id: taskData.assigneeId,
            },
            {
              onSuccess: () => {
                onSuccess();
                setTaskData({
                  name: "",
                  description: "",
                  status: "planned",
                  deadline: "",
                  blockers: "",
                  assigneeId: null,
                });
              },
            }
          );
        }}
      >
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            type="text"
            onChange={(e) => {
              setTaskData({ ...taskData, name: e.target.value });
            }}
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Input
            type="text"
            onChange={(e) => {
              setTaskData({ ...taskData, description: e.target.value });
            }}
          />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={taskData.status}
            onValueChange={(newValue) => {
              setTaskData({ ...taskData, status: newValue });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="blocked">Blocked </SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Deadline</Label>
          <Input
            type="date"
            value={taskData.deadline}
            onChange={(e) => {
              setTaskData({ ...taskData, deadline: e.target.value });
            }}
          />
        </div>

        <div className="space-y-2">
          <Label>Blockers</Label>
          <Input
            type="text"
            value={taskData.blockers}
            onChange={(e) => {
              setTaskData({ ...taskData, blockers: e.target.value });
            }}
          />
        </div>
        {loadingUsers && <p>Loading users...</p>}

        {!loadingUsers && (
          <div className="space-y-2">
            <Label>Assignee</Label>
            <Select
              disabled={!isAdmin}
              value={taskData.assigneeId?.toString() ?? "none"}
              onValueChange={(value) => {
                setTaskData({
                  ...taskData,
                  assigneeId: value === "none" ? null : Number(value),
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Not assigned</SelectItem>
                {assignedUsers?.users?.map((user: SelectUser) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex gap-2">
          {createTaskEroor && (
            <p className="text-red-500 text-sm">{createTaskEroor.message}</p>
          )}
          <Button type="submit">
            {pendingCreation ? "Creating..." : "Create"}
          </Button>
          <SheetClose asChild>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setTaskData({
                  name: "",
                  description: "",
                  status: "planned",
                  deadline: "",
                  blockers: "",
                  assigneeId: null,
                });
              }}
            >
              Close
            </Button>
          </SheetClose>
        </div>
      </form>
    </>
  );
}
