import Image from "next/image"
type ImageViewProps = {
    type: "project" | "task"|"comment"
    id : string ,
    isLoading?: boolean,
    onImageLoad?: (loaded: boolean) => void

}
import { Loader2 } from "lucide-react"
import { useGetImageByCommentId,useGetImageByProjectId,useGetImageByTaskId } from "@/hooks/image"


export default function ImageView({ type, id , isLoading: parentLoading, onImageLoad}: ImageViewProps) {
  
    const sizeClasses = {
      project: "w-full h-48",      
      task: "w-full h-32",          
      comment: "w-24 h-24"         
    }

    const projectImage = useGetImageByProjectId(
      id ?? "", 
      { enabled: type === "project" && !!id }
    );
    
    const taskImage = useGetImageByTaskId(
      id ?? "", 
      { enabled: type === "task" && !!id }
    );
    
    const commentImage = useGetImageByCommentId(
      id ? Number(id) : 0 , 
      { enabled: type === "comment" && !!id }
    );
  
   
    const { data, isLoading: imageLoading,error } = 
      type === "project" ? projectImage :
      type === "task" ? taskImage : 
      commentImage;

      const isLoading = (parentLoading ?? false) || imageLoading

     
      if (type === "comment" && !data?.imageUrl) {
        return null;
      }

    return (
      <div className={`relative ${sizeClasses[type]}`}>
        {error && <p>{error.message}</p>}
        {isLoading && <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /> } 

        {data?.imageUrl ?
        <Image 
        src={data.imageUrl} 
        alt={data.imageUrl.split("/").pop() ?? "Image"}
        onLoad={() => onImageLoad?.(true)}
        fill
        className="object-cover rounded-md"
      /> : "Here you can upload an image"}
        
      </div>
    )
  }