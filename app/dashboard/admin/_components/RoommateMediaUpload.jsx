'use client';
import React, { useState } from "react";
import Image from "next/image";
import { Loader2, Camera, Upload, Film } from "lucide-react";
import { toast } from "sonner";

export default function RoommateMediaUpload({ 
  onProfileUpload, 
  onRoomMediaUpload, 
  showRoomUpload 
}) {
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingRoom, setLoadingRoom] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [roomPreviews, setRoomPreviews] = useState([]);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "public"); // REPLACE THIS
    
    const resp = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      { method: "POST", body: formData }
    );
    return await resp.json();
  };

  const handleProfileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoadingProfile(true);
    try {
      const data = await uploadToCloudinary(file);
      setProfilePreview(data.secure_url);
      onProfileUpload(data.secure_url);
      toast.success("Profile photo updated");
      console.log("Cloudinary profile:", data);
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleRoomMediaChange = async (e) => {
    const files = Array.from(e.target.files);
    setLoadingRoom(true);
    const uploadedUrls = [];
    try {
      for (const file of files) {
        const data = await uploadToCloudinary(file);
        uploadedUrls.push({ url: data.secure_url, type: file.type });
      }
      setRoomPreviews((prev) => [...prev, ...uploadedUrls]);
      onRoomMediaUpload((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      toast.error("Room media upload failed");
    } finally {
      setLoadingRoom(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Picture Upload */}
      <div className="flex flex-col items-center gap-4">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Profile Photo</label>
        <div className="relative w-32 h-32">
          <div className="w-full h-full rounded-[2.5rem] bg-slate-100 overflow-hidden border-4 border-white shadow-lg">
            {profilePreview ? (
              <Image src={profilePreview} alt="Profile" fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-300">
                <Camera size={32} />
              </div>
            )}
          </div>
          <label className="absolute bottom-0 right-0 p-3 bg-blue-600 rounded-2xl text-white cursor-pointer hover:bg-blue-700 shadow-xl transition-all">
            {loadingProfile ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
            <input type="file" className="hidden" accept="image/*" onChange={handleProfileChange} />
          </label>
        </div>
      </div>

      {/* Room Media Upload (Conditional) */}
      {showRoomUpload && (
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room Photos/Videos</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <label className="aspect-square rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all bg-white">
              {loadingRoom ? <Loader2 className="animate-spin text-blue-600" /> : <Film className="text-slate-400" />}
              <span className="text-[10px] font-bold text-slate-400 mt-2">Add Media</span>
              <input type="file" className="hidden" multiple accept="image/*,video/*" onChange={handleRoomMediaChange} />
            </label>
            
            {roomPreviews.map((item, idx) => (
              <div key={idx} className="aspect-square rounded-3xl overflow-hidden relative border border-slate-100">
                {item.type.includes("video") ? (
                  <video src={item.url} className="w-full h-full object-cover" />
                ) : (
                  <Image src={item.url} alt="Room" fill className="object-cover" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}