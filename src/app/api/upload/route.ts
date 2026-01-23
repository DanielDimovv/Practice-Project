import { NextResponse } from "next/server"
import path from "path"

import { writeFile, mkdir } from "fs/promises";

import { createProjectImage,createTaskImage,createCommentImage } from "@/server/services/imageServices";



export async function POST(req:Request) {
  try {

    const formData = await req.formData()
    const file = formData.get("file") as unknown as File
    const type = formData.get("type") as "project" | "task" | "comment" | null;

    if (!file) {
      return NextResponse.json(
        {
          Success:false,
          message:"No file uploaded"
        }
      ),{status:400}
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true })

    const fileName = `${crypto.randomUUID()}`
    const filePath =  path.join(uploadsDir, fileName)

    console.log(filePath)

    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/${fileName}`

    let imageRecord;

    switch (type) {
      case "project":
        imageRecord = await createProjectImage({ url: imageUrl });
        break;
      case "task":
        imageRecord = await createTaskImage({ url: imageUrl });
        break;
      case "comment":
        imageRecord = await createCommentImage({ url: imageUrl });
        break;
    }

    return NextResponse.json({
      success: true,
      url:imageRecord?.url,
      imageId: imageRecord?.id
    })


  } catch (error) {
    console.error("Upload error:", error);
     return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
  
}























// import { writeFile, mkdir } from "fs/promises";
// import { NextRequest, NextResponse } from "next/server";
// import path from "path";
// import { createImage } from "@/server/services/imageServices";

// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData();
//     const file = formData.get("file") as File | null;

//     if (!file) {
//       return NextResponse.json({ error: "No file provided" }, { status: 400 });
//     }

//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     // Създай uploads папка ако не съществува
//     const uploadsDir = path.join(process.cwd(), "public", "uploads");
//     await mkdir(uploadsDir, { recursive: true });

//     // Уникално име на файла
//     const fileName = `${Date.now()}-${file.name}`;
//     const filePath = path.join(uploadsDir, fileName);

//     await writeFile(filePath, buffer);

//     return NextResponse.json({
//       path: `/uploads/${fileName}`,
//       message: "File uploaded successfully",
//     });
//   } catch (error) {
//     console.error("Upload error:", error);
//     return NextResponse.json({ error: "Upload failed" }, { status: 500 });
//   }
// }
