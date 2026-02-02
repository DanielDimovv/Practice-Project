import { Badge } from "../ui/badge"
import { Card } from "../ui/card"
import { Label } from "../ui/label"

type UserProp = {
   name:string,
    email:string,
    activity:string,
    time:number }

    type Props = {
        userdata: UserProp
    }


export default function ActivityCard({userdata}:Props){

    const user = {
        name:userdata.name,
        email:userdata.email,
        activity:userdata.activity,
        time:userdata.time
    }

    return <Card className="flex flex-col md:flex-row p-4 gap-4 md:justify-between">
  
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label className="min-w-[60px] shrink-0">Name</Label>
        <Badge className="truncate max-w-[150px]">{user.name}</Badge>
      </div>
      <div className="flex items-center gap-2">
        <Label className="min-w-[60px] shrink-0">Email</Label>
        <Badge className="truncate max-w-[150px]">{user.email}</Badge>
      </div>
    </div>
    

    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label className="min-w-[60px] shrink-0">Activity</Label>
        <Badge>{user.activity}</Badge>
      </div>
      <div className="flex items-center gap-2">
        <Label className="min-w-[60px] shrink-0">Time</Label>
        <Badge className="text-xs">{new Date(user.time * 1000).toLocaleString()}</Badge>
      </div>
    </div>
  </Card>

}