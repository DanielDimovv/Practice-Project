"use client";

import { useState } from "react";

type ImageUploadProps = {
  projectId?: string;
  taskId?: string;
  commentId?: number;
  
};

export default function test({ 
  projectId, 
  taskId, 
  commentId,
}: ImageUploadProps) {

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    
    // Добави ID-тата ако са подадени
    if (projectId) formData.append("projectId", projectId);
    if (taskId) formData.append("taskId", taskId);
    if (commentId) formData.append("commentId", commentId.toString());

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("File uploaded:", data);
        onUploadSuccess?.(data.image);
        setSelectedFile(null);
      } else {
        console.error("Error uploading file");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button type="submit" disabled={!selectedFile || isUploading}>
        {isUploading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
}