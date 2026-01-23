import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { SelectProject, SelectUser } from "@/server/db/schema";
import { Label } from "../ui/label";
import { useGetAssignedUsersToProject } from "@/hooks/user";
import ImageView from "../additional/ImageView";

type Props = {
  project: SelectProject;
};

export default function ViewProjectCard({ project }: Props) {
  const {
    data: assignedUsers,
    isLoading: loadingUsers,
    error: errorLoadingUsers,
  } = useGetAssignedUsersToProject(project.id);
  return (
    <Card className="overflow-hidden">
      <CardHeader>
      <div className="space-y-2 mt-2">
        <ImageView type={"project"} id={project.id} />
      </div>
        
        <div className="flex justify-between items-start">
          <CardTitle>{project.name}</CardTitle>
          <Badge variant="outline">{project.status}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 ">
        {project.description && (
          <>
            <Label>Description</Label>
            <p className="text-sm text-muted-foreground line-clamp-2 break-all h-10">
              {project.description}
            </p>
          </>
        )}

        {project.deadline && (
          <p className="text-sm">
            <span className="font-medium">Deadline: </span>
            {project.deadline}
          </p>
        )}
        <div>
          <Label>Assigned users:</Label>
          <div className="mt-2">
            {loadingUsers && <p>Loading users... </p>}
            {errorLoadingUsers && <p> {errorLoadingUsers.message}</p>}
            {!loadingUsers &&
              assignedUsers?.users?.map((user: SelectUser) => (
                <Badge key={user.id} variant="secondary">
                  {user.name}
                </Badge>
              ))}
          </div>
        </div>

        {project.blockers && (
          <>
            <Label>Blockers</Label>
            <p className="text-sm text-muted-foreground line-clamp-2 break-all h-10">
              {project.blockers}
            </p>
          </>
        )}
      </CardContent>

      <CardFooter>
        <Link href={`/project/${project.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            View
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
