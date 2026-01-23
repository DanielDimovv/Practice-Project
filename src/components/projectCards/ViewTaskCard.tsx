"use client";

import { Card } from "../ui/card";

import { Label } from "../ui/label";



import { SelectUser } from "@/server/db/schema";
import { Button } from "../ui/button";
import { useGetAssignedUsersToProject } from "@/hooks/user";
import { SelectTask, } from "@/server/db/schema";

import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import ImageView from "../additional/ImageView";

type Task = { task: SelectTask; projectId: string;
    setTaskEditing: React.Dispatch<React.SetStateAction<boolean>> ,
     isAdmin: boolean };

export default function ViewTaskCard({ task, setTaskEditing, projectId }: Task) {
  const router = useRouter();
  const { data: assignedUsers } = useGetAssignedUsersToProject(projectId);
 
  const taskData = {
    id: task.id,
    name: task.name,
    description: task.description ?? "",
    status: task.status ?? "planned",
    deadline: task.deadline ?? "",
    blockers: task.blockers ?? "",
    assignee_id: task.assignee_id,
  }


 

  return (
    <Card className="p-4 pt-0 space-y-4 mt-4">

      <div className="space-y-2 mt-2">
        <ImageView type={"task"} id={task.id} />
      </div>
      
        <div className="space-y-2 mt-2">
          <Label>Name</Label>
          
            <p className="font-medium text-lg">{taskData.name}</p>
         
        </div>
        <div className="space-y-2 ">
          <Label>Description</Label>

          
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {taskData.description || "No description"}
            </p>
         
        </div>
        <div className="flex justify-between gap-2">
          <div className="space-y-2">
            <Label>Status</Label>
            
              <Badge
                className="ml-2 bg-amber-300"
                variant={
                  taskData.status === "blocked" ? "destructive" : "secondary"
                }
              >
                {taskData.status.replace("_", " ")}
              </Badge>
           
          </div>
          <div className="space-y-2">
            <Label>Deadline</Label>
           
              <p className="text-sm">{taskData.deadline || "No deadline"}</p>
          
          </div>
        </div>

        <div className="space-y-2">
          <Label>Blockers</Label>
          
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {taskData.blockers || "No blockers"}
            </p>
       
        </div>
        <div className="space-y-2">
          <Label>Assignee</Label>
         
            <Badge variant="secondary" className="ml-2 bg-amber-300">
              {assignedUsers?.users?.find(
                (u: SelectUser) => u.id === taskData.assignee_id
              )?.name || "Not assigned"}
            </Badge>
         
        </div>
        <div className="flex gap-2">
        
          <Button
            type="button"
            
            onClick={(e) => {
                e.preventDefault();
                setTaskEditing(true);
              }}
          >
            Edit
          </Button>

          
        
        
        
          <Button
            type="button"
            onClick={() => {
              router.push(`/project/${projectId}`);
            }}
          >
            Back to project
          </Button>
         
        </div>
      
    </Card>
  );
}
