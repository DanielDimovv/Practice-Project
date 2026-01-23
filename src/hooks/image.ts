import { authFetch } from "@/lib/authFetch";
import { useQuery } from "@tanstack/react-query";




export function useGetImageByProjectId(
    projectId: string, 
    options?: { enabled?: boolean }
  ) {
    return useQuery({
      queryKey: ["imageToProject", projectId],
      queryFn: async () => {
        const response = await authFetch(`/api/upload/project/${projectId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch project image");
        }
        return response.json();
      },
      enabled: options?.enabled ?? !!projectId
    })
  }


  export function useGetImageByTaskId(taskId:string,options?:{enabled?:boolean}) {
    return useQuery({
      queryKey:["imageToTask", taskId],
      queryFn: async () => {
        const response = await authFetch(`/api/upload/task/${taskId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch task image")
        }
        return response.json();

      },
      enabled: options?.enabled ?? !!taskId

    })
  }

  export function useGetImageByCommentId (commentId:number,options?:{enabled?:boolean}) {
    return useQuery({
      queryKey:["imageToComment", commentId],
      queryFn: async () => {
        const response = await authFetch(`/api/upload/comment/${commentId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch comment image")
        }
        return response.json();
      },
      enabled:options?.enabled ?? !!commentId

    })
  }
