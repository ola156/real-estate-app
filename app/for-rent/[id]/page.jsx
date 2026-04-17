"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/utils/client";
import { Button } from "@/components/ui/button";
import {
  Play,
  MapPin,
  Verified,
  BedDouble,
  Phone,
  Loader2,
  Maximize,
  ArrowLeft,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export default function PropertyDetails() {
  const { id } = useParams();
  const router = useRouter();
  const videoRef = useRef(null);

  const [property, setProperty] = useState(null);
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getFullDetails() {
      try {
        setLoading(true);
        const { data } = await supabase
          .from("listing")
          .select("*")
          .eq("id", id)
          .single();
        const { data: videoData } = await supabase
          .from("listingImages")
          .select("url")
          .eq("listing_id", id);

        setProperty(data);
        setVideos(videoData || []);
        if (videoData?.length > 0) setActiveVideo(videoData[0].url);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) getFullDetails();
  }, [id]);

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );

  const formatDateTime = (isoString) => {
    if (!isoString) return { date: "Pending...", time: "" };
    const dateObj = new Date(isoString);

    // Formats to: 09 Apr 2026
    const date = dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    // Formats to: 09:15
    const time = dateObj.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return { date, time };
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Nav */}
      <div className="py-2 px-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm transition-all">
          <ArrowLeft size={18} /> Back to listings
        </button>
      </div>

      <main className="container mx-auto px-6 py-4">
        <div className="flex flex-col lg:flex-row md:gap-12 gap-7 items-stretch">
          {/* LEFT SIDE: The Video Theatre (Sticky) */}
          <div className="w-full  lg:w-[38%] lg:sticky lg:top-10 md:h-[60vh] h-full">
            <div className="relative group aspect-[4/5] md:aspect-video lg:aspect-[5/5] bg-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200">
              <video
                ref={videoRef}
                key={activeVideo}
                src={activeVideo}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Custom Overlay Controls - Updated for visibility on small screens */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                <div className="flex justify-between items-center">
                  <button
                    onClick={toggleFullScreen}
                    className="p-3 md:p-4 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white/40 active:scale-95 transition-all">
                    <Maximize size={20} className="md:w-6 md:h-6" />
                  </button>
                  <p className="text-white/90 ml-2 text-[10px] font-bold uppercase tracking-widest">
                    Virtual Tour Active
                  </p>
                </div>
              </div>

              {/* Verified Tag */}
              {property?.active && (
                <div className="absolute top-6 left-6 bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-black uppercase">
                    Verified
                  </span>
                </div>
              )}
            </div>

            {/* Video Thumbnails underneath */}
            {videos.length > 1 && (
              <div className="flex gap-3 mt-6 overflow-x-auto pb-2 no-scrollbar">
                {videos.map((vid, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveVideo(vid.url)}
                    className={`relative flex-shrink-0 w-24 h-24 rounded-3xl overflow-hidden border-4 transition-all ${
                      activeVideo === vid.url
                        ? "border-blue-600 scale-105"
                        : "border-transparent opacity-50"
                    }`}>
                    <video className="w-full h-full object-cover">
                      <source src={vid.url} />
                    </video>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDE: Information & Actions */}
          <div className="w-full md:mt-[150px] lg:mt-2 sm:mt-2 lg:w-[45%] flex flex-col justify-between py-4">
            <div className="space-y-8">
              {/* Header */}
              <div className="flex justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-[0.2em] mb-3">
                    <MapPin size={18} /> {property?.area || "Ibadan, Nigeria"}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                    {property?.address}
                  </h1>
                </div>
                <div className="flex flex-col md:gap-2 ">
                  <p className="text-[10px] md:text-sm font-light text-primary">
                    Agent Name :
                  </p>
                  <p className=" text-sm md:text-md text-slate-900 font-bold ">
                    {property?.agent || "Usman Olayinka"}
                  </p>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">
                    Room Type
                  </p>
                  <p className="font-bold text-slate-900 text-sm md:text-md">
                    {property?.propertyType}
                  </p>
                </div>
                <div className="p-1 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <div className="">
                    {/* Date & Time Unit */}
                    <div className="p-4 bg-slate-50 rounded-[2rem] border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">
                        Listed On
                      </p>
                      <div className="flex flex-col">
                        <p className="font-bold text-slate-900 text-sm">
                          {formatDateTime(property?.created_at).date}
                        </p>
                        <p className="text-[12px] text-slate-500 font-medium">
                          at {formatDateTime(property?.created_at).time}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  Details
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                  {property?.description ||
                    "A premium living space located in a prime area of Ibadan, offering maximum comfort and modern amenities."}
                </p>
              </div>

              {/* Pricing breakdown */}

              <div className="bg-slate-50 rounded-[2.5rem] p-6 space-y-4">
                <div className="flex justify-between items-center text-slate-500 font-bold text-sm">
                  <span>Yearly Rent</span>
                  <span className="text-slate-900">
                    ₦ {Number(property?.rent).toLocaleString()}
                  </span>
                </div>
                <div className="h-px bg-slate-200 w-full" />
                <div className="flex justify-between items-center">
                  <span className="text-slate-950 font-black text-lg">
                    Total Package
                  </span>
                  <span className="text-blue-600 font-black text-2xl tracking-tighter">
                    ₦ {Number(property?.totalPackage).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button at the very bottom */}
            <div className="mt-12">
              <Button
                onClick={() =>
                  window.open(
                    `https://wa.me/${property?.agent_num}?text=I am interested in the ${property?.propertyType} at ${property?.address} you posted on Instrict Real Estate App. when can i come for inspection? `,
                    "_blank",
                  )
                }
                className="w-full h-18 rounded-[2rem] bg-slate-950 hover:bg-blue-600 text-white font-black text-lg transition-all flex items-center justify-between px-8 group shadow-xl shadow-slate-200">
                <span>Reserve this Space</span>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-blue-600 transition-all">
                  <ChevronRight />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
