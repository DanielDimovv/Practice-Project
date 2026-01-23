"use client";
import { useState } from "react";
import { Card } from "../ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "../ui/select";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

import { SelectUser } from "@/server/db/schema";
import { Button } from "../ui/button";
import { useGetAssignedUsersToProject } from "@/hooks/user";
import { SelectTask, TaskStatus } from "@/server/db/schema";
import { Textarea } from "../ui/textarea";
import { useDeleteTask, useUpdateTask } from "@/hooks/task";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

import ImageUploader from "../additional/ImageUploader";

type Task = { task: SelectTask;setTaskEditing: React.Dispatch<React.SetStateAction<boolean>> , projectId: string; isAdmin: boolean };

export default function EditTaskCard({ task, projectId, isAdmin,setTaskEditing }: Task) {
  const router = useRouter();
  const { data: assignedUsers } = useGetAssignedUsersToProject(projectId);

  const [taskData, setTaskData] = useState({
    id: task.id,
    name: task.name,
    description: task.description ?? "",
    status: task.status ?? "planned",
    deadline: task.deadline ?? "",
    blockers: task.blockers ?? "",
    assignee_id: task.assignee_id,
    imageId:undefined as number | undefined 

  });

  const {
    mutate: deleteTask,
    isPending: isDeleting,
    error: deleteError,
  } = useDeleteTask(taskData.id, projectId);
  const {
    mutate: updateTask,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateTask(taskData.id, projectId);

  return (
    <Card className="p-4 pt-0">
      <form
        className="space-y-4 mt-4"
        onSubmit={(e) => {
          e.preventDefault();
          updateTask(taskData, {
            onSuccess: () => {
              setTaskEditing(false);
            },
          });
        }}
      >
        <ImageUploader type={"task"} onUploadComplete={(imageId) => setTaskData(prevTaskData => ({...prevTaskData, imageId}))} />
        <div className="space-y-2">
          <Label>Name</Label>
          
            <Input
              type="text"
              value={taskData.name}
              onChange={(e) => {
                setTaskData({ ...taskData, name: e.target.value });
              }}
            />
          
        </div>
        <div className="space-y-2 ">
          <Label>Description</Label>

          
            <Textarea
              rows={3}
              value={taskData.description}
              onChange={(e) => {
                setTaskData({ ...taskData, description: e.target.value });
              }}
            />
          
        </div>
        <div className="flex justify-between gap-2">
          <div className="space-y-2">
            <Label>Status</Label>
            
              <Select
                value={taskData.status}
                onValueChange={(newValue) => {
                  setTaskData({ ...taskData, status: newValue as TaskStatus });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
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
        </div>

        <div className="space-y-2">
          <Label>Blockers</Label>
          
            <Textarea
              rows={2}
              value={taskData.blockers}
              onChange={(e) => {
                setTaskData({ ...taskData, blockers: e.target.value });
              }}
            />
         
        </div>
        <div className="space-y-2">
          <Label>Assignee</Label>
          
            <Select
              disabled={!isAdmin}
              value={taskData.assignee_id?.toString() ?? "none"}
              onValueChange={(value) => {
                setTaskData({
                  ...taskData,
                  assignee_id: value === "none" ? null : Number(value),
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
        <div className="flex gap-2">
          {updateError && (
            <p className="text-red-500 text-sm">{updateError.message}</p>
          )}
          {deleteError && (
            <p className="text-red-500 text-sm">{deleteError.message}</p>
          )}
          

          <Button type="submit" >
            {isUpdating ? "Saving..." : "Save"}
          </Button>
         
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setTaskData({
                  id: task.id,
                  name: task.name,
                  description: task.description ?? "",
                  status: task.status ?? "planned",
                  deadline: task.deadline ?? "",
                  blockers: task.blockers ?? "",
                  assignee_id: task.assignee_id,
                  imageId:undefined
                });
                setTaskEditing(false);
              }}
            >
              Close
            </Button>
         
          <Button
            type="button"
            onClick={() => {
              router.push(`/project/${projectId}`);
            }}
          >
            Back to project
          </Button>
          {isAdmin && (
            <div className="ml-auto">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" className="bg-red-600 hover:bg-red-400">
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The task will be permanently
                      deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteTask()}
                      className="bg-red-600 hover:bg-red-500"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </form>
    </Card>
  );
}
