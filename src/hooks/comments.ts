import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authFetch } from "@/lib/authFetch";

export type CommentWithUser = {
  id: number;
  content: string;
  createdAt: number;
  userId: number;
  userName: string;
};

type CommentsResponse = {
  taskComments: CommentWithUser[];
};

export function useGetAllComments(taskId: string, projectId: string) {
  return useQuery<CommentsResponse>({
    queryKey: ["allTaskComments", taskId],
    queryFn: async () => {
      const response = await authFetch(
        `/api/dashboard/project/${projectId}/task/${taskId}/comments`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch the task comments");
      }

      return response.json();
    },
  });
}

export function useCreateComment(taskId: string, projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { content: string }) => {
      const response = await authFetch(
        `/api/dashboard/project/${projectId}/task/${taskId}/comments`,
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
      queryClient.invalidateQueries({ queryKey: ["allTaskComments", taskId] });
    },
  });
}

export function useEditComment(taskId: string, projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => {
      const response = await authFetch(
        `/api/dashboard/project/${projectId}/task/${taskId}/comments/${commentId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allTaskComments", taskId] });
    },
  });
}

export function useDeleteComment(taskId: string, projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      const response = await authFetch(
        `/api/dashboard/project/${projectId}/task/${taskId}/comments/${commentId}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allTaskComments", taskId] });
    },
  });
}
