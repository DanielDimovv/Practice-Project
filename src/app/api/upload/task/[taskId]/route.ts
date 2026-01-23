import { getImageByTaskId } from "@/server/services/imageServices";
import { requireAuth } from "@/server/services/sessionService";



export async function GET(
    _request: Request,
    { params }: { params: Promise<{ taskId: string }> }
  ) {

    try{
        const { error } = await requireAuth()
        if (error) {
          return Response.json({ error }, { status: 401 })
        }

        const {taskId} = await params

        const image = await getImageByTaskId(taskId)


        return Response.json({ 
            imageUrl: image?.url ?? null 
          }, { status: 200 })
      
        } catch {
          return Response.json({ error: "Failed to fetch image" }, { status: 500 })
        }
      }