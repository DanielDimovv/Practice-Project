
import { requireAuth } from "@/server/services/sessionService";
import { getLastActivities } from "@/server/services/trackActivity";



export async function GET() {

    try{


        const {user,error} = await requireAuth()
        if (error) {
            return Response.json({ error }, { status: 401 });
          }

          const activities = await getLastActivities()

          return Response.json(activities,{status:200})

    } catch{
        return Response.json(
            {
              error: "Failed to fetch activities history",
            },
            { status: 500 }
          );
        }
    }
    


