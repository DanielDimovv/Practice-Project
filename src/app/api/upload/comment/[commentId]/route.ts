

import { getImageByCommentId } from "@/server/services/imageServices"
import { requireAuth } from "@/server/services/sessionService"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { error } = await requireAuth()
    if (error) {
      return Response.json({ error }, { status: 401 })
    }

    const { commentId } = await params

    const image = await getImageByCommentId(Number(commentId))

    return Response.json({ 
      imageUrl: image?.url ?? null 
    }, { status: 200 })

  } catch {
    return Response.json({ error: "Failed to fetch image" }, { status: 500 })
  }
}