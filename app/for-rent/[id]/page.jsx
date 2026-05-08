"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/utils/client";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Loader2,
  Maximize,
  ArrowLeft,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export default function PropertyDetails() {
  const { id } = useParams();
  const router = useRouter();
  const mediaRef = useRef(null);

  const [property, setProperty] = useState(null);
  const [agent, setAgent] = useState(null);
  const [mediaItems, setMediaItems] = useState([]); 
  const [activeMedia, setActiveMedia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getFullDetails() {
      try {
        setLoading(true);
        
        // 1. Fetch Property
        const { data: propData } = await supabase
          .from("listing")
          .select("*")
          .eq("id", id)
          .single();

        // 2. Fetch Media (Images or Videos)
        const { data: videoData } = await supabase
          .from("listingImages")
          .select("url")
          .eq("listing_id", id);

        // 3. Fetch Agent (Assuming profiles.id matches listing.user_id)
        if (propData?.user_id) {
          const { data: agentData } = await supabase
            .from("profiles")
            .select("agency_name, phoneNo")
            .eq("id", propData.user_id)
            .single();
          if (agentData) setAgent(agentData);
        }

        setProperty(propData);
        setMediaItems(videoData || []);
        if (videoData?.length > 0) setActiveMedia(videoData[0].url);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) getFullDetails();
  }, [id]);

  // HELPER: Detect if URL is a video
  const isVideo = (url) => {
    if (!url) return false;
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".quicktime"];
    return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext)) || url.includes("video");
  };

  const toggleFullScreen = () => {
    if (mediaRef.current) {
      if (mediaRef.current.requestFullscreen) {
        mediaRef.current.requestFullscreen();
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
    const date = dateObj.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const time = dateObj.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    return { date, time };
  };

  return (
    <div className="min-h-screen bg-white mt-25">
      <div className="py-2 px-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm transition-all">
          <ArrowLeft size={18} /> Back to listings
        </button>
      </div>

      <main className="container mx-auto px-6 py-4">
        <div className="flex flex-col lg:flex-row md:gap-12 gap-7 items-stretch">
          
          {/* LEFT SIDE: Media Theatre */}
          <div className="w-full lg:w-[38%] lg:sticky lg:top-10 md:h-[60vh] h-full">
            <div className="relative group aspect-[4/5] md:aspect-video lg:aspect-[5/5] bg-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200">
              
              {/* DYNAMIC MEDIA RENDERER */}
              {isVideo(activeMedia) ? (
                <video
                  ref={mediaRef}
                  key={activeMedia}
                  src={activeMedia}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  ref={mediaRef}
                  src={activeMedia}
                  alt="Property"
                  className="w-full h-full object-cover"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                <div className="flex justify-between items-center">
                  <button onClick={toggleFullScreen} className="p-3 md:p-4 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white/40 active:scale-95 transition-all">
                    <Maximize size={20} className="md:w-6 md:h-6" />
                  </button>
                  <p className="text-white/90 ml-2 text-[10px] font-bold uppercase tracking-widest">
                    {isVideo(activeMedia) ? "Virtual Tour Active" : "Property Photo"}
                  </p>
                </div>
              </div>

              {property?.active && (
                <div className="absolute top-6 left-6 bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-black uppercase">Verified</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {mediaItems.length > 1 && (
              <div className="flex gap-3 mt-6 overflow-x-auto pb-2 no-scrollbar">
                {mediaItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveMedia(item.url)}
                    className={`relative flex-shrink-0 w-24 h-24 rounded-3xl overflow-hidden border-4 transition-all ${
                      activeMedia === item.url ? "border-blue-600 scale-105" : "border-transparent opacity-50"
                    }`}
                  >
                    {isVideo(item.url) ? (
                      <video className="w-full h-full object-cover"><source src={item.url} /></video>
                    ) : (
                      <img src={item.url} className="w-full h-full object-cover" alt="thumb" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDE: Info */}
          <div className="w-full lg:w-[45%] flex flex-col justify-between py-4">
            <div className="space-y-8">
              <div className="flex justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-[0.2em] mb-3">
                    <MapPin size={18} /> {property?.area || "Ibadan, Nigeria"}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight">
                    {property?.address}
                  </h1>
                </div>
                <div className="text-right">
                  <p className="text-[10px] md:text-sm font-light text-primary">Agency:</p>
                  <p className="text-sm md:text-md text-slate-900 font-bold">
                    {agent?.agency_name || property?.agent || "Usman Olayinka"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Room Type</p>
                  <p className="font-bold text-slate-900 text-sm md:text-md">{property?.propertyType}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Listed On</p>
                  <p className="font-bold text-slate-900 text-sm">{formatDateTime(property?.created_at).date}</p>
                  <p className="text-[12px] text-slate-500 font-medium">at {formatDateTime(property?.created_at).time}</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-[2.5rem] p-6 space-y-4">
                <div className="flex justify-between items-center text-slate-500 font-bold text-sm">
                  <span>Yearly Rent</span>
                  <span className="text-slate-900">₦ {Number(property?.rent).toLocaleString()}</span>
                </div>
                <div className="h-px bg-slate-200 w-full" />
                <div className="flex justify-between items-center">
                  <span className="text-slate-950 font-black text-lg">Total Package</span>
                  <span className="text-blue-600 font-black text-2xl tracking-tighter">
                    ₦ {Number(property?.totalPackage).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <Button
                onClick={() =>
                  window.open(
                    `https://wa.me/${agent?.phoneNo || property?.agent_num}?text=I am interested in the ${property?.propertyType} at ${property?.address}. When can I come for inspection?`,
                    "_blank"
                  )
                }
                className="w-full h-18 rounded-[2rem] bg-slate-950 hover:bg-blue-600 text-white font-black text-lg transition-all flex items-center justify-between px-8 group shadow-xl shadow-slate-200"
              >
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