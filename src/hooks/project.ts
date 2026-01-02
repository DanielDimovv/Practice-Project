import { UpdateProject } from "@/app/api/dashboard/project/[id]/route";
import { InsertProject } from "@/server/db/schema";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/authFetch";

export function useGetAllProjects() {}

export function useGetProjectByID(projectID: string) {
  return useQuery({
    queryKey: ["currentProject", projectID],
    queryFn: async () => {
      const response = await authFetch(`/api/dashboard/project/${projectID}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the project");
      }

      return response.json();
    },
  });
}

export function useGetProjectsByUserID() {}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InsertProject) => {
      const response = await authFetch("/api/dashboard/create-project", {
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
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      
    },
  });
}

export function useUpdateProject(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateProject) => {
      const response = await authFetch(`/api/dashboard/project/${projectId}`, {
        method: "PATCH",
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
      queryClient.invalidateQueries({
        queryKey: ["currentProject", projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["assignedUsersToProject", projectId],
      });
    },
  });
}

export function useDeleteProject(projectId: string) {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const response = await authFetch(`/api/dashboard/project/${projectId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      return await response.json();
    },
    onSuccess: () => {
      router.push("/dashboard");
    },
  });
}
