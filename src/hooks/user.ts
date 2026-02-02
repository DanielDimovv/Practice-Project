import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InsertUser, SelectUser } from "@/server/db/schema";
import { authFetch } from "@/lib/authFetch";
import { error } from "console";


export function useGetActivityHistory() {
  return useQuery({
    queryKey:["activityHistory"],
    queryFn: async () => {
      const response = await authFetch('/api/activity-log',{
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch activities log");
      }
      
      const data = await response.json()
      return data
    }
  })
}


export function useGetUserProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await authFetch("/api/dashboard", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

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
      const response = await authFetch(
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
      const response = await authFetch("/api/users", {
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


export function useCreateNewUser(){
  return useMutation({
    mutationFn: async (userData:InsertUser) => {
      const response = await authFetch("/api/users", {
        method:"POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      }) 

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error)
      }

      return await response.json()
    }
  })
}

export function useUpdateUserData() {
  return useMutation({
    mutationFn: async ({
      userId,
      userData,
    }: {
      userId: number;
      userData: InsertUser;
    }) => {
      const response = await authFetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( userData ),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      return await response.json();
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: number) => {
      const response = await authFetch(`/api/users/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
