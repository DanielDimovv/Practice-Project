import { useQuery } from "@tanstack/react-query";
import { SelectUser } from "@/server/db/schema";

export function useGetUserProjects(userId: number, role: string) {
  return useQuery({
    queryKey: ["projects", userId, role],
    queryFn: async () => {
      const response = await fetch(
        `/api/dashboard?userId=${userId}&role=${role}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();
      return data;
    },
  });
}

export function useGetAssignedUsersToProject(projectID: string) {
  return useQuery({
    queryKey: ["assignedUsersToProject", projectID],
    queryFn: async () => {
      const response = await fetch(
        `/api/dashboard/project/${projectID}/users`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users assigned to the project");
      }

      const data = await response.json();
      return data;
    },
  });
}

export function useGetAllUsers() {
  return useQuery<SelectUser[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/users", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      return data.users;
    },
  });
}
