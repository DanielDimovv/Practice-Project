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
import { SelectProject } from "@/server/db/schema";
import { Label } from "../ui/label";

type Props = {
  project: SelectProject;
};

export default function ViewProjectCard({ project }: Props) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
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
            <span className="font-medium">Deadline:</span>
            {project.deadline}
          </p>
        )}

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
