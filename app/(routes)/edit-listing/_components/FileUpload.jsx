'use client';
import Image from "next/image";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";

function FileUpload({ setImages, imageList }) {
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const uploadedUrls = [];
    const localPreviews = [];

    try {
      for (const file of files) {
        // 1. Create FormData for Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "public"); // Replace with your preset
        
        // 2. Upload to Cloudinary API
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
          { method: "POST", body: formData }
        );

        const data = await response.json();
        
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
          localPreviews.push({
            url: data.secure_url,
            type: file.type,
          });
        }
      }

      // 3. Update Parent state and local previews
      setImages(uploadedUrls); // Now sending actual Cloudinary URLs to parent
      setPreviews(localPreviews);
      
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className={`flex flex-col items-center justify-center w-full h-64 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] cursor-pointer hover:bg-slate-100 transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <Loader2 className="w-8 h-8 mb-4 animate-spin text-blue-600" />
            ) : (
              <svg className="w-8 h-8 mb-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            )}
            <p className="mb-2 text-sm text-slate-500">
              <span className="font-semibold">{uploading ? "Uploading..." : "Click to upload"}</span>
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            accept="image/*,video/*"
            className="hidden"
            multiple
            disabled={uploading}
            onChange={handleFileUpload}
          />
        </label>
      </div>

      {/* Cloudinary Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {previews.map((file, index) => (
            <div key={index} className="relative aspect-video rounded-2xl overflow-hidden border border-slate-100">
              {file.type.startsWith("video/") ? (
                <video src={file.url} controls className="w-full h-full object-cover" />
              ) : (
                <Image src={file.url} alt="check" fill className="object-cover" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FileUpload;