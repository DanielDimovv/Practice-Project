"use client"

import ActivityCard from "@/components/additional/ActivityCard";
import ManageUsers from "@/components/manageUsers/ManageUsers";
import { useGetActivityHistory } from "@/hooks/user";
import { Card } from "@/components/ui/card";


export default function ManageUsersPage() {

    const {data:records, isLoading,error} = useGetActivityHistory()

    return<>
    <div className="flex flex-col md:flex-row gap-4 ">
        <div className="flex-1"><ManageUsers /></div>
        <div className="flex-1 space-y-2">
            {isLoading && <p>Loading...</p>}
            {error && <p>{error.message} </p>}
            
            <Card className="h-[530] overflow-y-auto p-4 space-y-4">

            {records && records.map((activity) => <ActivityCard key={activity.id} userdata={activity} />) }
            </Card>
            
        </div>
   

    </div>
  
    </>
}