import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authFetch } from "@/lib/authFetch";

type TaskData = {
  name: string;
  description?: string;
  status: string;
  deadline: string;
  blockers?: string;
  assignee_id?: number | null;
};

export function useGetTaskById(projectId: string, taskId: string) {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const response = await authFetch(
        `/api/dashboard/project/${projectId}/task/${taskId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch the task");
      }
      return response.json();
    },
  });
}

export function useGetProjectTasks(projectId: string) {
  return useQuery({
    queryKey: ["projectTasks", projectId],
    queryFn: async () => {
      const response = await authFetch(
        `/api/dashboard/project/${projectId}/task`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch the project tasks");
      }

      return response.json();
    },
  });
}

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TaskData) => {
      const response = await authFetch(
        `/api/dashboard/project/${projectId}/task`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectTasks", projectId] });
    },
  });
}

export function useUpdateTask(taskId: string, projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TaskData) => {
      const response = await authFetch(
        `/api/dashboard/project/${projectId}/task/${taskId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectTasks", projectId] });
    },
  });
}

export function useUpdateTaskStatus(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: string }) => {
      const response = await authFetch(
        `/api/dashboard/project/${projectId}/task/${taskId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update task status");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectTasks", projectId] });
    },
  });
}

export function useDeleteTask(taskId: string, projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await authFetch(
        `/api/dashboard/project/${projectId}/task/${taskId}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectTasks", projectId] });
    },
  });
}
