"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/utils/client";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  MapPin,
  ShieldCheck,
  Maximize,
  ArrowLeft,
  ChevronRight,
  Building,
} from "lucide-react";

export default function SaleDescriptionPage() {
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
        const { data: propertyData, error: propError } = await supabase
          .from("listing")
          .select("*")
          .eq("id", id)
          .single();

        const { data: videoData } = await supabase
          .from("listingImages")
          .select("url")
          .eq("listing_id", id);

        if (propError) throw propError;

        setProperty(propertyData);
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
    if (videoRef.current?.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return { date: "Pending...", time: "" };
    const dateObj = new Date(isoString);
    const date = dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const time = dateObj.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date, time };
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );

  if (!property) return <div className="p-20 text-center font-black uppercase">Property Not Found</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Top Nav - Responsive Padding */}
      <div className="py-4 px-4 md:px-6 max-w-7xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm transition-all"
        >
          <ArrowLeft size={18} /> Back to listings
        </button>
      </div>

      <main className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          
          {/* LEFT SIDE: Video Theatre - Sticky on Desktop, Static on Mobile */}
          <div className="w-full lg:w-[40%] lg:sticky lg:top-10 h-fit">
            <div className="relative group aspect-[4/5] sm:aspect-video lg:aspect-[5/6] bg-slate-100 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200">
              {activeVideo ? (
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
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-4">
                  <Building size={48} />
                  <span className="text-[10px] font-black uppercase tracking-widest">No Video Available</span>
                </div>
              )}

              {/* Overlay Controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                <div className="flex justify-between items-center">
                  <button
                    onClick={toggleFullScreen}
                    className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white/40 active:scale-95 transition-all"
                  >
                    <Maximize size={20} />
                  </button>
                  <p className="text-white/90 text-[10px] font-bold uppercase tracking-widest">
                    Virtual Property Tour
                  </p>
                </div>
              </div>

              {/* Verified Tag */}
              {property?.active && (
                <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-blue-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-xl flex items-center gap-2 shadow-lg">
                  <ShieldCheck size={14} className="md:w-4 md:h-4" />
                  <span className="text-[9px] md:text-[10px] font-black uppercase">Verified Listing</span>
                </div>
              )}
            </div>

            {/* Thumbnails - Horizontal Scroll on Mobile */}
            {videos.length > 1 && (
              <div className="flex gap-3 mt-6 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
                {videos.map((vid, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveVideo(vid.url)}
                    className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl overflow-hidden border-4 transition-all ${
                      activeVideo === vid.url ? "border-blue-600 scale-105" : "border-transparent opacity-60"
                    }`}
                  >
                    <video className="w-full h-full object-cover pointer-events-none">
                      <source src={vid.url} />
                    </video>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDE: Information */}
          <div className="w-full lg:w-[55%] flex flex-col py-2">
            <div className="space-y-8 md:space-y-10">
              
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]">
                    <MapPin size={16} /> {property?.address}
                  </div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl  mt-2 font-black text-slate-950 tracking-tight leading-none uppercase ">
                    {property?.propertyType}
                  </h1>
                </div>
               
              </div>

              {/* Specs Grid - Responsive Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 w-full sm:w-auto">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Agent</p>
                  <p className="text-sm font-black text-slate-900">{property?.agent || "Official Agent"}</p>
                </div>
                <div className="px-6 py-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Listed On</p>
                  <div className="flex items-baseline gap-2">
                    <p className="font-bold text-slate-900 text-sm md:text-base">
                      {formatDateTime(property?.created_at).date}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {formatDateTime(property?.created_at).time}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest opacity-50">Property Description</h3>
                <p className="text-base md:text-lg text-slate-600 leading-relaxed font-medium">
                  {property?.description || "High-value real estate opportunity in Ibadan with premium documentation and verified ownership."}
                </p>
              </div>

              {/* Pricing Section */}
              <div className="bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 space-y-2 border border-slate-800 shadow-xl shadow-slate-100">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">Asking Price</p>
                <div className="flex items-baseline gap-2">
                   <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter">
                    ₦ {Number(property?.totalPackage).toLocaleString()}
                  </h2>
                </div>
                <p className="text-[10px] text-slate-400 font-medium italic">Includes all legal documentation and transfer fees</p>
              </div>
            </div>

            {/* Action Button - Floating/Large at bottom */}
            <div className="mt-10 md:mt-14">
              <Button
                onClick={() =>
                  window.open(
                    `https://wa.me/${property?.agent_num || "2348087442174"}?text=I am interested in buying the ${property?.propertyType} at ${property?.address}. I saw the listing on your Instrict Website and would like to schedule an inspection.`,
                    "_blank"
                  )
                }
                className="w-full h-18 md:h-20 rounded-[1.5rem] md:rounded-[2rem] bg-blue-600 hover:bg-slate-950 text-white font-black text-base md:text-lg transition-all flex items-center justify-between px-6 md:px-10 group shadow-2xl shadow-blue-100"
              >
                <span>Inquire for Purchase</span>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-blue-600 transition-all">
                  <ChevronRight size={24} />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}