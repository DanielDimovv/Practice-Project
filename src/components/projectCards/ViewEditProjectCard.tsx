import { useGetProjectByID } from "@/hooks/project";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { useGetAllUsers } from "@/hooks/user";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import CreateTaskCard from "./CreateTaskCard";
import { useState } from "react";
import { SelectUser } from "@/server/db/schema";
import { SelectProject } from "@/server/db/schema";

type props = {
  projectId: string;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  isAdmin: boolean;
  userName: string;
  assignedUsers: SelectUser[];
  projectData: SelectProject;
};

export default function ViewEditProjectCard({
  projectId,
  setIsEditing,
  userName,
  isAdmin,
  assignedUsers,
  projectData,
}: props) {
  //   const {
  //     data: project,
  //     isLoading: projectLoading,
  //     isError: projectError,

  //   } = useGetProjectByID(projectId);
  const { data: allUsers } = useGetAllUsers();

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const assignedUsersToProject = assignedUsers.map((u) => u.id);

  console.log(assignedUsersToProject);

  return (
    <Card className="w-full max-w-md mx-auto p-4 sm:p-6 ">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Name</Label>

          <p className="font-medium text-lg">{projectData.name}</p>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>

          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {projectData.description || "No description"}
          </p>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>

          <Badge
            className="ml-2 bg-amber-400"
            variant={
              projectData.status === "blocked" ? "destructive" : "secondary"
            }
          >
            {projectData.status}
          </Badge>
        </div>
        <div className="space-y-2">
          <Label>Deadline</Label>

          <p className="text-sm">{projectData.deadline || "No deadline"}</p>
        </div>
        <div className="space-y-2">
          <Label>Blockers</Label>

          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {projectData.blockers || "No blockers"}
          </p>
        </div>

        <div className="space-y-2 ">
          <Label>Assigned Users</Label>
          <div className="flex flex-wrap gap-2 mt-2 -mb-2">
            {assignedUsersToProject?.length === 0 ? (
              <p className="text-muted-foreground text-sm">No users assigned</p>
            ) : (
              allUsers
                ?.filter((u) => assignedUsersToProject?.includes(u.id))
                .map((user) => (
                  <Badge key={user.id} variant="secondary">
                    {user.name}
                  </Badge>
                ))
            )}
          </div>
        </div>
        <div className="flex mt-5  ">
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsEditing(true);
            }}
          >
            Edit
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
      </div>
    </Card>
  );
}
