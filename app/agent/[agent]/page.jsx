"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/client";
import { 
  Loader2, MapPin, Search, User, ArrowLeft, SlidersHorizontal, 
  Home, Moon, ShieldCheck, AlertCircle, Video, Image as ImageIcon 
} from "lucide-react";
import Link from "next/link";

export default function AgentListings({ params }) {
  const unwrappedParams = React.use(params);
  const agentName = decodeURIComponent(unwrappedParams.agent);

  const [agentProfile, setAgentProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [category, setCategory] = useState("All");

  // HELPER: Detect if the URL is a video
  const isVideo = (url) => {
    if (!url) return false;
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".quicktime"];
    return (
      videoExtensions.some((ext) => url.toLowerCase().endsWith(ext)) ||
      url.includes("video")
    );
  };

  useEffect(() => {
    async function fetchAgentData() {
      try {
        setLoading(true);
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("agency_name", agentName)
          .single();

        if (profileError || !profile) {
          setError("Agent not found");
          return;
        }

        if (!profile.is_link_active) {
          setError("Link Disabled");
          return;
        }

        setAgentProfile(profile);

        const { data: listingsData, error: listingsError } = await supabase
          .from("listing")
          .select("*, listingImages(url)")
          .eq("user_id", profile.id)
          .eq("active", true)
          .order("created_at", { ascending: false });

        if (listingsError) throw listingsError;
        
        setListings(listingsData || []);
        setFilteredListings(listingsData || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Could not load listings");
      } finally {
        setLoading(false);
      }
    }

    if (agentName) fetchAgentData();
  }, [agentName]);

  useEffect(() => {
    let result = listings;
    if (category !== "All") result = result.filter((l) => l.type === category);
    if (searchQuery) {
      result = result.filter((l) => 
        l.area?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        l.address?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (propertyType) result = result.filter((l) => l.propertyType?.trim() === propertyType);
    if (maxPrice) {
      const [min, max] = maxPrice.split("-").map(Number);
      result = result.filter((l) => {
        const priceValue = l.type === "Sale" ? (l.totalPackage || 0) : (l.rent || 0);
        const numericPrice = Number(priceValue);
        if (!max) return numericPrice >= min;
        return numericPrice >= min && numericPrice <= max;
      });
    }
    setFilteredListings(result);
  }, [searchQuery, maxPrice, propertyType, category, listings]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );

  if (error) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
        <AlertCircle size={40} />
      </div>
      <h2 className="text-3xl font-black text-slate-900 mb-2">{error}</h2>
      <p className="text-slate-500 mb-8 max-w-sm">This agent profile is currently unavailable or the link has been deactivated.</p>
      <Link href="/" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs">Back to Marketplace</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20 md:pt-10 pt-1 mt-20">
      <div className="max-w-6xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-[10px] uppercase tracking-widest mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to Home
        </Link>

        {/* Agent Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 p-8 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-blue-200">
              <User size={38} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={14} className="text-blue-600" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Verified Marketplace Agent</p>
              </div>
              <h1 className="text-3xl font-black text-slate-950 tracking-tight leading-none">{agentProfile?.agency_name}</h1>
              <p className="text-slate-400 font-bold text-sm mt-1">Rep: {agentProfile?.full_name}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex bg-white p-1 rounded-2xl border border-slate-200 w-fit lg:self-end">
              {["All", "Rent", "Sale", "ShortLet"].map((option) => (
                <button
                  key={option}
                  onClick={() => setCategory(option)}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    category === option 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                    : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text"
                  placeholder="Search areas..."
                  className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 w-full lg:w-48"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <select 
                  className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none w-full appearance-none shadow-sm"
                  onChange={(e) => setPropertyType(e.target.value)}
                  value={propertyType}
                >
                  <option value="">All Types</option>
                  <option value="Room self-contained">Room self-contained</option>
                  <option value="Room & Palor self-con">Room & Palor self-con</option>
                  <option value="Single Room">Single Room</option>
                  <option value="Room in a flat">Room in a flat</option>
                  <option value="1 Bed Room">1 Bedroom</option>
                  <option value="2 Bed Room">2 Bedroom</option>
                  <option value="3 Bed Room">3 Bedroom</option>
                  <option value="Land">Land</option>
                </select>

                <select 
                  className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none w-full appearance-none shadow-sm"
                  onChange={(e) => setMaxPrice(e.target.value)}
                  value={maxPrice}
                >
                  <option value="">All Prices</option>
                  <option value="0-100000">Under ₦100k</option>
                  <option value="100001-150000">Under ₦150k</option>
                  <option value="150001-200000">₦150k - ₦200k</option>
                  <option value="200001-300000">₦200k - ₦300k</option>
                  <option value="300001-400000">₦300k - ₦400k</option>
                  <option value="400001-600000">₦400k - ₦600k</option>
                  <option value="600001-800000">₦600k - ₦800k</option>
                  <option value="800001-1000000">₦400k - ₦1M</option>
                  <option value="1000001">Above ₦1M</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
          {filteredListings.map((item) => {
            const firstMedia = item.listingImages?.[0]?.url;
            const isVid = isVideo(firstMedia);

            return (
              <div key={item.id} className="group flex flex-col">
                <div className="relative aspect-video rounded-[3.5rem] overflow-hidden bg-slate-100 border-[12px] border-white shadow-2xl shadow-slate-200/60">
                  {firstMedia ? (
                    isVid ? (
                      <video 
                        src={firstMedia} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        muted loop playsInline
                        onMouseOver={(e) => e.target.play()}
                        onMouseOut={(e) => e.target.pause()}
                      />
                    ) : (
                      <img 
                        src={firstMedia} 
                        alt={item.address}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-200">
                      <ImageIcon size={48} />
                    </div>
                  )}
                  
                  {/* Media Type Indicator */}
                  <div className="absolute bottom-6 right-6 bg-white/20 backdrop-blur-md p-2 rounded-full text-white">
                    {isVid ? <Video size={14} /> : <ImageIcon size={14} />}
                  </div>

                  <div className="absolute top-6 left-6 flex gap-2">
                    <div className="bg-white/95 backdrop-blur px-4 py-2 rounded-2xl text-slate-900 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      {item.type === "Shortlet" ? <Moon size={12} className="text-blue-600" /> : <Home size={12} className="text-blue-600" />}
                      {item.propertyType}
                    </div>
                  </div>

                  <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest border border-white/10">
                    {item.type}
                  </div>
                </div>

                <div className="mt-8 px-4 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="max-w-[70%]">
                      <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-widest mb-2">
                        <MapPin size={14} /> {item.area}
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-tight uppercase truncate">
                        {item.address}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-slate-900 tracking-tighter">
                         ₦{(item.type === "Sale" ? item.totalPackage : item.rent)?.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                        {item.type === "Sale" ? "Total" : item.type === "ShortLet" ? "Daily" : "Yearly"}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      const route = item.type === "Sale" ? "for-sale" : item.type === "Shortlet" ? "shortlet" : "for-rent";
                      window.location.href = `/${route}/${item.id}`;
                    }}
                    className="mt-auto w-full py-5 bg-slate-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-[0.98] shadow-xl shadow-slate-200"
                  >
                    Explore Property
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredListings.length === 0 && (
          <div className="text-center py-32 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200">
             <SlidersHorizontal className="mx-auto mb-4 text-slate-300" size={48} />
             <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No active listings found in this category.</p>
             <button 
               onClick={() => {setSearchQuery(""); setPropertyType(""); setMaxPrice(""); setCategory("All");}}
               className="mt-4 text-blue-600 font-black text-xs uppercase tracking-widest hover:underline"
             >
               Clear Filters
             </button>
          </div>
        )}
      </div>
    </div>
  );
}