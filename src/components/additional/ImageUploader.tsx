
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";

import React, { useState } from "react";




interface UploadImageProps {
  type: "project" | "task" | "comment";
    onUploadComplete?: (imageId: number) => void;
  }

export default function ImageUploader({type,onUploadComplete}:UploadImageProps) {

    const [file,setFile] = useState<File | null>(null)
    const [preview,setPreview] = useState<string | null>(null)
    //const [uploadedUrl,setUploadeUrl] = useState<string | null>(null)
    const [isUploaded, setIsUploaded] = useState(false);

    const [loading,setLoading] = useState(false)


    const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {

        const selected = e.target.files?.[0]

        if (preview) {
            URL.revokeObjectURL(preview)
          }

        if(selected){
            setFile(selected)
            setPreview(URL.createObjectURL(selected))
        }

        

    }

    
    const handleUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if(!file) return
        setLoading(true)
        const formData = new FormData()
        formData.append("file",file)
        formData.append("type",type)

        const res = await fetch('/api/upload', {
            method:"POST",
            body:formData
        })

        const data = await res.json()
      //  setUploadeUrl(data.url)
        setLoading(false)
        onUploadComplete?.(data.imageId)
        setIsUploaded(true)
    }

    return(
        <div className="space-y-2">
        
        
        {type === "comment" ? (
  <label className="cursor-pointer p-2 hover:bg-gray-100 rounded">
    Add image 
    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
  </label>
) : (
        <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
          <input 
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 file:cursor-pointer" 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
          />
          
          {preview && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Preview</p>
              <img className="max-w-full h-32 object-contain mx-auto rounded-lg" src={preview} alt="preview"/>
            </div>
          )}
        </div> )}
      
        <button 
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300" 
          onClick={handleUpload} 
          disabled={!file || loading}
        >
          {loading ? "Uploading..." : (type === "comment" ? "Upload" : "Upload Image")}
        </button>

        {isUploaded && <Badge className="bg-green-400">Uploaded</Badge>}
        
        {/* {uploadedUrl && (
          <div className="mt-2">
            <p className="text-sm text-gray-500">Uploaded:</p>
            <img className="w-full h-32 object-contain rounded-lg border mt-1" src={uploadedUrl} alt="uploaded"/>
          </div>
        )} */}
      </div>
    )
}

