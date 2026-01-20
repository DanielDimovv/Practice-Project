import { Label } from "../ui/label";

import React, { useState } from "react";




export default function UploadImage() {

    const [file,setFile] = useState<File | null>(null)
    const [preview,setPreview] = useState<string | null>(null)
    const [uploadedUrl,setUploadeUrl] = useState<string | null>(null)
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

    
    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(!file) return
        setLoading(true)
        const formData = new FormData()
        formData.append("file",file)

        const res = await fetch('/api/upload', {
            method:"POST",
            body:formData
        })

        const data = await res.json()
        setUploadeUrl(data.url)
        setLoading(false)
    }

    return(
        <div>
            <Label>Upload Image</Label>
            <div>
                <input type="file" accept="image/*" onChange={handleFileChange}/>
                {preview && <div>
                    <p>Preview</p>
                    <img src={preview} alt={preview}/> </div>}
            </div>

            <button onClick={handleUpload} disabled={!file || loading}> {loading ? "Uploading..." : "Upload Image"}</button>
            
            {uploadedUrl && (<div>
                <p>Uploaded Image:</p>
                <img src={uploadedUrl} alt="uploaded"/>
            </div>)}
            
        </div>
    )
}

