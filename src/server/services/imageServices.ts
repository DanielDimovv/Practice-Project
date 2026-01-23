import { db } from "../db/client";
import { eq } from "drizzle-orm";
import { commentImages, commentImagesCross, InsertCommentImage, InsertProjectImage, InsertTaskImage, projectImages, projectImagesCross, SelectProjectImage, taskImages, taskImagesCross } from "../db/schema";



export async function getImageByProjectId(project_id:string){

  const [image] = await db.select({
    id:projectImages.id,
    url:projectImages.url
  }).from(projectImagesCross).innerJoin(projectImages,eq(projectImagesCross.image_id,projectImages.id)).where(eq(projectImagesCross.project_id,project_id))

  return image
}


export async function getImageByTaskId(task_id:string) { 

  const [image] = await db.select({
    id:taskImages.id,
    url:taskImages.url
  }).from(taskImagesCross).innerJoin(taskImages,eq(taskImagesCross.image_id,taskImages.id)).where(eq(taskImagesCross.task_id,task_id))

  return image
}

export async function getImageByCommentId(comment_id:number) {

  const [image] = await db.select({
    id:commentImages.id,
    url:commentImages.url
  }).from(commentImagesCross).innerJoin(commentImages,eq(commentImagesCross.image_id,commentImages.id)).where(eq(commentImagesCross.comment_id,comment_id))

  return image
  
}



// export async function createProjectImage(data:InsertProjectImage, project_id:string) { const [createdImage] = await db.insert(projectImages).values(data).returning()

//   const reference = await db.insert(projectImagesCross).values({project_id,image_id:createdImage.id})

// if(!reference){return}

//  return createdImage
 
//  }

 
export async function createProjectImage(data: InsertProjectImage) {
  
    const [createdImage] = await db.insert(projectImages).values(data).returning();

    

    return createdImage;
  
}

export async function createProjectImageJunction( projectId:string, imageId:number) { 

  const [imageRef] = await db.insert(projectImagesCross).values({project_id:projectId,image_id:imageId}).returning()

  return imageRef
  
}



export async function createTaskImage(data:InsertTaskImage) {

  const [createdImage] = await db.insert(taskImages).values(data).returning()

  return createdImage
  
}

export async function createTaskImageJunction( taskId:string, imageId:number) { 

  const [imageRef] = await db.insert(taskImagesCross).values({task_id:taskId,image_id:imageId}).returning()

  return imageRef
  
}

export async function createCommentImage(data:InsertCommentImage){

  const[createdImage] = await db.insert(commentImages).values(data).returning()

  return createdImage
}


export async function createCommentImageJunction( commentId:number, imageId:number) {
  const [imageRef] = await db.insert(commentImagesCross).values({comment_id:commentId,image_id:imageId}).returning()

  return imageRef
}






export async function deleteProjectImage(id: number) {
  const [deleted] = await db
    .delete(projectImages)
    .where(eq(projectImages.id, id))
    .returning();
  
  return deleted !== undefined;
}


export async function deleteTaskImage(id: number) {
  const [deleted] = await db
    .delete(taskImages)
    .where(eq(taskImages.id, id))
    .returning();
  
  return deleted !== undefined;
}


export async function deleteCommentImage(id: number) {
  const [deleted] = await db
    .delete(commentImages)
    .where(eq(commentImages.id, id))
    .returning();
  
  return deleted !== undefined;
}




// export async function createProjectImage(data: InsertProjectImage, project_id: string) {
//   return await db.transaction(async (tx) => {
//     const [createdImage] = await tx.insert(projectImages).values(data).returning();

//     await tx.insert(projectImagesCross).values({
//       project_id,
//       image_id: createdImage.id,
//     });

//     return createdImage;
//   });
// }


// export async function createTaskImage(data:InsertTaskImage, task_id:string) {
//   return await db.transaction(async (tx) => {
//     const [createdImage] = await tx.insert(taskImages).values(data).returning()

//     await tx.insert(taskImagesCross).values({
//       task_id,
//       image_id:createdImage.id
//     })

//     return createdImage
//   })
// }

// export async function createCommentImage(data:InsertCommentImage,comment_id:number) {
//   return await db.transaction( async (tx) => {
//     const [createdImage] = await tx.insert(commentImages).values(data).returning()

//     await tx.insert(commentImagesCross).values({
//       comment_id,
//       image_id:createdImage.id

//     })

//     return createdImage
//   })
// }





// export async function updateProjectImage(id: number, url: string) {
//   const [updated] = await db
//     .update(projectImages)
//     .set({ url })
//     .where(eq(projectImages.id, id))
//     .returning();
  
//   return updated;
// }


// export async function updateTaskImage(id: number, url: string) {
//   const [updated] = await db
//     .update(taskImages)
//     .set({ url })
//     .where(eq(taskImages.id, id))
//     .returning();
  
//   return updated;
// }


// export async function updateCommentImage(id: number, url: string) {
//   const [updated] = await db
//     .update(commentImages)
//     .set({ url })
//     .where(eq(commentImages.id, id))
//     .returning();
  
//   return updated;
// }




// import { db } from "../db/client";
// import {
//   projectsTable,
//   projectTasks,
//   taskComments,
//   SelectImage,
//   InsertImage,
//   images,
// } from "../db/schema";

// import { eq } from "drizzle-orm";

// export async function getImagesByProjectId(projectId: string) {
//   return db.select().from(images).where(eq(images.project_id, projectId));
// }

// export async function getImagesByTaskId(taskId: string) {
//   return db.select().from(images).where(eq(images.task_id, taskId));
// }

// export async function getImagesByCommentId(commentId: number) {
//   return db.select().from(images).where(eq(images.comment_id, commentId));
// }

// export async function createImage(
//   data: InsertImage
// ): Promise<SelectImage> {
//   const [createdImage] = await db.insert(images).values(data).returning();

//   return createdImage;
// }

// export async function updateImage(id: number, data: SelectImage) {
//   const [updatedImage] = await db
//     .update(images)
//     .set(data)
//     .where(eq(images.id, id))
//     .returning();

//   return updatedImage;
// }

// export async function deleteImage(id: number) {
//   const [deletedImage] = await db
//     .delete(images)
//     .where(eq(images.id, id))
//     .returning();

//   return deletedImage !== undefined;
// }
