"use client";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { useState } from "react";
import UserMultiselect from "./UserMultiSelect";
import { SelectProject } from "@/server/db/schema";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CreateTaskCard from "./CreateTaskCard";
import { useDeleteProject } from "@/hooks/project";
import { SelectUser } from "@/server/db/schema";
import { Badge } from "@/components/ui/badge";
import { useGetAllUsers } from "@/hooks/user";

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

export type EditProject = {
  name: string;
  description: string;
  status: string;
  deadline: string;
  blockers: string;
  userIds: number[];
};

type Props = {
  projectID: string;
  projectData: SelectProject;
  assignedUsers: SelectUser[];
  onSubmit: (data: EditProject) => void;
  isPendingProject: boolean;
  errorProject?: Error | null;
  isAdmin: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EditProjectCard({
  projectID,
  projectData,
  assignedUsers,
  onSubmit,
  isPendingProject,
  errorProject,
  isAdmin,
  setIsEditing,
}: Props) {
  const { mutate: deleteProject, isPending: isDeleting } =
    useDeleteProject(projectID);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [formData, setFormData] = useState<EditProject>({
    name: projectData.name,
    description: projectData.description ?? "",
    status: projectData.status,
    deadline: projectData.deadline,
    blockers: projectData.blockers ?? "",
    userIds: assignedUsers.map((u) => u.id),
  });
  const { data: allUsers } = useGetAllUsers();

  return (
    <Card className="w-full max-w-md mx-auto p-4 sm:p-6 ">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
          setIsEditing(false);
        }}
      >
        <div className="space-y-2">
          <Label>Attach a picture</Label>
          <input type="file" accept="image/*" onChange={handleUpload} />
        </div>
        <div className="space-y-2">
          <Label>Name</Label>

          <Input
            type="text"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
            }}
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>

          <Textarea
            rows={3}
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
            }}
          />
        </div>

        <div className="space-y-2">
          <Label>Status</Label>

          <Select
            value={formData.status}
            onValueChange={(newValue) =>
              setFormData({ ...formData, status: newValue })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="in progress">In Progress</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Deadline</Label>

          <Input
            type="date"
            value={formData.deadline}
            onChange={(e) => {
              setFormData({ ...formData, deadline: e.target.value });
            }}
          />
        </div>
        <div className="space-y-2">
          <Label>Blockers</Label>

          <Textarea
            rows={2}
            value={formData.blockers}
            onChange={(e) => {
              setFormData({ ...formData, blockers: e.target.value });
            }}
          />
        </div>

        <div className="space-y-2">
          <Label>Assigned Users</Label>
          <div className="flex flex-wrap gap-2 mt-2 -mb-2">
            {formData.userIds.length === 0 ? (
              <p className="text-muted-foreground text-sm">No users assigned</p>
            ) : (
              allUsers
                ?.filter((u) => formData.userIds.includes(u.id))
                .map((user) => (
                  <Badge key={user.id} variant="secondary">
                    {user.name}
                  </Badge>
                ))
            )}
          </div>
        </div>
        {isAdmin && (
          <div className="space-y-2">
            <UserMultiselect
              selectedUserIds={formData.userIds}
              onChange={(ids) => {
                setFormData({ ...formData, userIds: ids });
              }}
            />
          </div>
        )}

        {errorProject && (
          <p className="text-red-500 text-sm">{errorProject.message}</p>
        )}
        <div className="flex gap-2">
          <Button type="submit" disabled={isPendingProject}>
            {isPendingProject ? "Saving..." : "Save"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({
                name: projectData.name,
                description: projectData.description ?? "",
                status: projectData.status,
                deadline: projectData.deadline,
                blockers: projectData.blockers ?? "",
                userIds: assignedUsers.map((u) => u.id),
              });
              setIsEditing(false);
            }}
          >
            Close
          </Button>

          <div className="ml-auto">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button type="button">Add task</Button>
              </SheetTrigger>
              <SheetContent>
                <CreateTaskCard
                  projectId={projectData.id}
                  onSuccess={() => setIsSheetOpen(false)}
                  isAdmin={isAdmin}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
        {isAdmin && (
          <div className="flex justify-center">
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
                    This action cannot be undone. The project will be
                    permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteProject()}
                    className="bg-red-600 hover:bg-red-500"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </form>
    </Card>
  );
}
