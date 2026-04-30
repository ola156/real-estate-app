"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/utils/client";
import {
  Loader2,
  MapPin,
  ArrowLeft,
  Share2,
  CheckCircle2,
  Coffee,
  Wifi,
  Car,
  ShieldCheck,
  Tv,
  Wind,
  Calendar,
} from "lucide-react";

export default function ShortletDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("listing")
          .select("*, listingImages(url)")
          .eq("id", id)
          .single();

        if (error) throw error;
        setListing(data);
      } catch (err) {
        console.error("Error fetching detail:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchDetails();
  }, [id]);

  const handleBooking = () => {
    const message = `Hello, I'm interested in booking the Shortlet at ${listing.address} (${listing.area}) priced at ₦${Number(listing.rent).toLocaleString()} per night.`;
    const whatsappUrl = `https://wa.me/${listing.agent_num}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );

  if (!listing)
    return <div className="p-20 text-center font-bold">Listing not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Navigation */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-slate-900">
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Visuals & Info */}
          <div className="lg:col-span-8">
           <div className="relative w-full lg:aspect-[21/9] aspect-[4/3] rounded-[3rem] overflow-hidden bg-black shadow-2xl border-[6px] md:border-[10px] border-white group transition-all duration-500">
    <video 
      id="shortlet-video"
      src={listing.listingImages?.[0]?.url} 
      className="w-full h-full object-cover"
      autoPlay 
      muted 
      loop
      playsInline
    />
    
    {/* Status Badge */}
    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-5 py-2 rounded-2xl shadow-xl z-10">
       <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">Premium Stay</p>
    </div>

    {/* Minimalist Fullscreen Icon Button */}
    <button 
      onClick={() => {
        const video = document.getElementById('shortlet-video');
        if (video.requestFullscreen) video.requestFullscreen();
        else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
      }}
      className="absolute bottom-6 right-6 bg-white/20 hover:bg-white/40 backdrop-blur-xl text-white p-4 rounded-full transition-all border border-white/30 shadow-2xl active:scale-90 z-20"
      title="View Fullscreen"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
      </svg>
    </button>

    {/* Subtle Gradient Overlay for better contrast */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
  </div>

            <div className="mt-12">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-4">
                <MapPin size={16} />Ibadan.
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tighter mb-6 leading-tight">
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
                  "Indulge in a blend of luxury and comfort. This short-let is designed to provide a home-away-from-home experience, featuring modern aesthetics and top-tier hospitality services."}
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
                className="w-full py-4 bg-blue-600 text-white rounded-[2rem] font-black text-sm hover:bg-slate-950 transition-all shadow-xl shadow-blue-100 active:scale-[0.98]">
                Reserve Space
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
