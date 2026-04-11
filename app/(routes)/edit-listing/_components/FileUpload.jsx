'use client';
import Image from "next/image";
import React, { useState } from "react";
''
function FileUpload({setImages, imageList}) {
  const [previews, setPreviews] = useState([]);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setImages(files);
    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type, // e.g. "video/mp4", "image/png" 
       }
  ));
   console.log(newPreviews);
    setPreviews(newPreviews);
  };

  return (
    <div>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 bg-neutral-secondary border border-dashed border-default-strong rounded-base cursor-pointer hover:bg-neutral-tertiary-medium">
          <div className="flex flex-col items-center justify-center text-body pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs">SVG, PNG, JPG, GIF, or Video (MAX. 800x400px)</p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            accept="image/*,video/*"
            className="hidden"
            multiple
            onChange={handleFileUpload}
          />
        </label>
      </div>

      {previews.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4">
          {previews.map((file, index) =>
            file.type.startsWith("video/") ? (
              <video
                key={index}
                src={file.url}
                controls
                autoPlay
                muted
                playsInline
                preload="metadata"
                className="w-full max-w-sm  rounded-md"
              >
                 <source src={file.url} type={file.type} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <Image
                key={index}
                src={file.url}
                alt={`preview-${index}`}
                  width={200}
                  height={200}
                className=" object-cover rounded-md"
              />
            )
          )}
        </div>
      )}

      {imageList && imageList.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4">
          {imageList.map((file, index) => (
             <video
                key={index}
                src={file?.url}
                controls
                autoPlay
                muted
                playsInline
                preload="metadata"
                className="w-full max-w-sm  rounded-md"
              >
                 <source src={file?.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
          ))}
        </div>
      )}

    </div>
  );
}

export default FileUpload;