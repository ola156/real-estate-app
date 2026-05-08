"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/utils/client";
import {
  Loader2,
  MapPin,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Maximize,
  Image as ImageIcon,
} from "lucide-react";

export default function ShortletDetail() {
  const { id } = useParams();
  const router = useRouter();
  const mediaRef = useRef(null);

  const [listing, setListing] = useState(null);
  const [agent, setAgent] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);
  const [activeMedia, setActiveMedia] = useState(null);
  const [loading, setLoading] = useState(true);

  // HELPER: Detect if URL is a video
  const isVideo = (url) => {
    if (!url) return false;
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".quicktime"];
    return (
      videoExtensions.some((ext) => url.toLowerCase().endsWith(ext)) ||
      url.includes("video")
    );
  };

  useEffect(() => {
    async function fetchDetails() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("listing")
          .select("*, listingImages(url)")
          .eq("id", id)
          .single();

        if (data?.user_id) {
          const { data: agentData } = await supabase
            .from("profiles")
            .select("agency_name, phoneNo")
            .eq("id", data.user_id)
            .single();
          if (agentData) setAgent(agentData);
        }

        if (error) throw error;
        
        setListing(data);
        // Extract images/videos from the join
        const media = data.listingImages || [];
        setMediaItems(media);
        if (media.length > 0) setActiveMedia(media[0].url);
        
      } catch (err) {
        console.error("Error fetching detail:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchDetails();
  }, [id]);

  const handleBooking = () => {
    const message = `Hello, I'm interested in booking the Shortlet at ${listing.address} priced at ₦${Number(listing.rent).toLocaleString()} per day.`;
    const whatsappUrl = `https://wa.me/${agent?.phoneNo || listing.agent_num}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const toggleFullScreen = () => {
    if (mediaRef.current?.requestFullscreen) {
      mediaRef.current.requestFullscreen();
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );

  if (!listing)
    return <div className="p-20 text-center font-bold uppercase">Listing not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 mt-20">
      {/* Header Navigation */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-slate-900 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 mt-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Visuals & Info */}
          <div className="lg:col-span-8">
            {/* MAIN MEDIA THEATRE */}
            <div className="relative w-full lg:aspect-[16/10] aspect-[4/3] rounded-[3rem] overflow-hidden bg-slate-200 shadow-2xl border-[6px] md:border-[10px] border-white group transition-all duration-500">
              {activeMedia ? (
                isVideo(activeMedia) ? (
                  <video
                    ref={mediaRef}
                    key={activeMedia} // Key ensures video reloads when source changes
                    src={activeMedia}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    ref={mediaRef}
                    src={activeMedia}
                    alt="Listing"
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest">
                  No Media Available
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-5 py-2 rounded-2xl shadow-xl z-10 flex items-center gap-2">
                <ShieldCheck size={14} className="text-blue-600" />
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                  Premium Stay
                </p>
              </div>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullScreen}
                className="absolute bottom-6 right-6 bg-white/20 hover:bg-white/40 backdrop-blur-xl text-white p-4 rounded-full transition-all border border-white/30 shadow-2xl active:scale-90 z-20"
              >
                <Maximize size={20} strokeWidth={2.5} />
              </button>

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* THUMBNAILS (For multiple images/videos) */}
            {mediaItems.length > 1 && (
              <div className="flex gap-3 mt-6 overflow-x-auto pb-4 no-scrollbar">
                {mediaItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveMedia(item.url)}
                    className={`relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all ${
                      activeMedia === item.url ? "border-blue-600 scale-105" : "border-white opacity-70"
                    }`}
                  >
                    {isVideo(item.url) ? (
                      <video src={item.url} className="w-full h-full object-cover pointer-events-none" />
                    ) : (
                      <img src={item.url} className="w-full h-full object-cover" alt={`thumb-${idx}`} />
                    )}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-12">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-4">
                <MapPin size={16} /> Ibadan.
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tighter mb-6 leading-tight uppercase">
                {listing.address}
              </h1>

              <div className="flex flex-wrap gap-3 mb-10">
                <span className="px-5 py-2 bg-slate-200/50 rounded-xl text-[11px] font-bold text-slate-700 uppercase">
                  {listing.propertyType}
                </span>
                <span className="px-5 py-2 bg-blue-50 rounded-xl text-[11px] font-bold text-blue-600 uppercase tracking-widest">
                  Fully Serviced
                </span>
              </div>

              <h2 className="text-xl font-black text-slate-950 mb-4 uppercase tracking-tight">
                The Space
              </h2>
              <p className="text-slate-600 leading-relaxed font-medium mb-4">
                {listing.description ||
                  "Indulge in a blend of luxury and comfort. This short-let is designed to provide a home-away-from-home experience."}
              </p>
            </div>
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-white p-8 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100">
              <div className="mb-8">
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">
                  Daily Rate
                </p>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-black text-slate-950 tracking-tighter">
                    ₦{Number(listing.rent).toLocaleString()}
                  </span>
                  <span className="text-slate-400 font-bold text-sm mb-1">
                    /day
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                  <Calendar className="text-blue-600" size={20} />
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      Minimum Stay
                    </p>
                    <p className="text-sm font-bold text-slate-900">1 Day</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                  <CheckCircle2 className="text-green-500" size={20} />
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      Status
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      Instant Booking
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBooking}
                className="w-full py-4 bg-blue-600 text-white rounded-[2rem] font-black text-sm hover:bg-slate-950 transition-all shadow-xl shadow-blue-100 active:scale-[0.98]"
              >
                Reserve Space
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}