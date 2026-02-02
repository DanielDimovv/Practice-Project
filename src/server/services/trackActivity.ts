import { db } from "../db/client";
import { eq, desc,asc, count, inArray} from "drizzle-orm";

import { trackActivity,InsertTrackActivity, usersTable } from "../db/schema";




export async function getLastActivities() {

    const activities = await db.select({
        name:usersTable.name,
        email:usersTable.email,
        activity:trackActivity.operation,
        time:trackActivity.time
    }).from(trackActivity).innerJoin(usersTable, eq(trackActivity.user_id,usersTable.id)).orderBy(desc(trackActivity.time)).limit(20)

    return activities
    
}


export async function createActivity (data:InsertTrackActivity) {

    const [activity] = await db.insert(trackActivity).values(data).returning()

    return activity
}


export async function cleanupOldActivities() {
    
    const result = await db.select({ count: count() }).from(trackActivity);
    const totalCount = result[0].count;

    if (totalCount <= 20) {
        return false;  
      }
    
      const toDelete = totalCount - 20;
      const oldestIds = await db.select({id: trackActivity.id})
      .from(trackActivity)
      .orderBy(asc(trackActivity.time))
      .limit(toDelete);
  
    const idsToDelete = oldestIds.map(activity => activity.id);
  
    const deleted = await db.delete(trackActivity).where(inArray(trackActivity.id, idsToDelete));
    

    return deleted !== undefined
  }