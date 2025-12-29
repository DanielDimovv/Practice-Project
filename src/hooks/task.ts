import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type TaskData = {
  name: string;
  description?: string;
  status: string;
  deadline: string;
  blockers?: string;
  assignee_id?: number | null;
};

export function useGetProjectTasks(projectId: string) {
  return useQuery({
    queryKey: ["projectTasks", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/dashboard/project/${projectId}/task`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
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
      const response = await fetch(`/api/dashboard/project/${projectId}/task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
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
      const response = await fetch(
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

export function useDeleteTask(taskId: string, projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(
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
