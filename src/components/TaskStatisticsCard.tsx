import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SelectTask } from "@/server/db/schema";

interface tasks {
  tasks: SelectTask[];
}

export default function TaskStatisticsCard({ tasks }: tasks) {
  const stats = {
    planned: tasks?.filter((t) => t.status === "planned").length ?? 0,
    in_progress: tasks?.filter((t) => t.status === "in_progress").length ?? 0,
    blocked: tasks?.filter((t) => t.status === "blocked").length ?? 0,
    done: tasks?.filter((t) => t.status === "done").length ?? 0,
  };

  const total = stats.planned + stats.in_progress + stats.blocked + stats.done;

  return (
    <Card className=" w-full max-w-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Task Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex h-3 rounded-full overflow-hidden">
          {stats.planned > 0 && (
            <div
              className="bg-gray-400"
              style={{ width: `${(stats.planned / total) * 100}%` }}
            />
          )}
          {stats.in_progress > 0 && (
            <div
              className="bg-blue-500"
              style={{ width: `${(stats.in_progress / total) * 100}%` }}
            />
          )}
          {stats.blocked > 0 && (
            <div
              className="bg-red-500"
              style={{ width: `${(stats.blocked / total) * 100}%` }}
            />
          )}
          {stats.done > 0 && (
            <div
              className="bg-green-500"
              style={{ width: `${(stats.done / total) * 100}%` }}
            />
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400" />
              <span className="text-sm font-medium">Planned</span>
            </div>
            <Badge variant="secondary" className="text-base px-3">
              {stats.planned}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm font-medium">In Progress</span>
            </div>
            <Badge variant="secondary" className="text-base px-3">
              {stats.in_progress}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm font-medium">Blocked</span>
            </div>
            <Badge variant="destructive" className="text-base px-3">
              {stats.blocked}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm font-medium">Done</span>
            </div>
            <Badge className="bg-green-500 text-base px-3">{stats.done}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
