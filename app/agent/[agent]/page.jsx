"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/client";
import { Loader2, MapPin, Search, User, ArrowLeft, SlidersHorizontal, Home } from "lucide-react";
import Link from "next/link";

export default function AgentListings() {
  const { agent } = useParams();
  const agentName = decodeURIComponent(agent);

  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [propertyType, setPropertyType] = useState("");

  useEffect(() => {
    async function fetchAgentProperties() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("listing")
          .select("*, listingImages(url)")
          .eq("agent", agentName)
          .eq("active", true)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setListings(data || []);
        setFilteredListings(data || []);
      } catch (err) {
        console.error("Error fetching agent listings:", err);
      } finally {
        setLoading(false);
      }
    }
    if (agentName) fetchAgentProperties();
  }, [agentName]);

  useEffect(() => {
    let result = listings;

    if (searchQuery) {
      result = result.filter((l) => 
        l.area?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        l.address?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Property Type Filter (Strictly using propertyType)
    if (propertyType) {
      result = result.filter((l) => {
        const dbValue = l.propertyType?.toString().trim();
        return dbValue === propertyType;
      });
    }

  // Range-based Price Filtering
  if (maxPrice) {
    // We split the value (e.g., "150000-300000") into two numbers
    const [min, max] = maxPrice.split("-").map(Number);

    result = result.filter((l) => {
      const rentString = String(l.rent || "0");
      const numericPrice = parseInt(rentString.replace(/[^0-9]/g, ""), 10);
      
      // If there is no "max" (for the 1M+ category), just check the minimum
      if (!max) return numericPrice >= min;
      
      // Otherwise, check if it falls between min and max
      return numericPrice >= min && numericPrice <= max;
    });
  }

    setFilteredListings(result);
  }, [searchQuery, maxPrice, propertyType, listings]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20 md:pt-14 pt-3">
      <div className="max-w-6xl mx-auto px-6">
        
        <Link href="/for-rent" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-[10px] uppercase tracking-widest mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to Search
        </Link>

     {/* Agent Header & Filter Bar */}
<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 p-8 bg-slate-50 rounded-[3rem] border border-slate-100">
  <div className="flex items-center gap-6">
    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
      <User size={32} />
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-1">Verified Agent</p>
      <h1 className="text-2xl font-black text-slate-950 tracking-tight">{agentName}</h1>
    </div>
  </div>

  <div className="flex flex-col gap-3">
    {/* Search bar takes full width on mobile */}
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
      <input 
        type="text"
        placeholder="Search area..."
        className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 w-full lg:w-48"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
    
    {/* Grid container for side-by-side selects on small screens */}
    <div className="grid grid-cols-2 gap-3">
      <select 
        className="px-3 py-3 bg-white border border-slate-200 rounded-2xl text-[12px] md:text-sm font-medium focus:ring-2 focus:ring-blue-600 outline-none w-full appearance-none"
        onChange={(e) => setPropertyType(e.target.value)}
      >
        <option value="">All Types</option>
        <option value="Room self-contained">Room self-contained</option>
        <option value="Room in a flat">Room in a flat</option>
        <option value="Single Room">Single Room</option>
        <option value="Room and palor self-contained">Room and palor self-contained</option>
        <option value="2 Bed Room">2 Bed Room</option>
        <option value="3 Bed Room">3 Bed Room</option>
      </select>

      <select 
        className="px-3 py-3 bg-white border border-slate-200 rounded-2xl text-[12px] md:text-sm font-medium focus:ring-2 focus:ring-blue-600 outline-none w-full appearance-none"
        onChange={(e) => setMaxPrice(e.target.value)}
      >
        <option value="">All Prices</option>
        <option value="100000-150000">₦100k - ₦150k</option>
        <option value="150001-300000">₦150k - ₦300k</option>
        <option value="300001-600000">₦300k - ₦600k</option>
        <option value="600001-1000000">₦600k - ₦1M</option>
        <option value="1000001">Above ₦1M</option>
      </select>
    </div>
  </div>
</div>

        {/* Responsive Grid Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
          {filteredListings.map((item) => (
            <div key={item.id} className="group flex flex-col">
              
              <div className="relative aspect-video rounded-[3rem] overflow-hidden bg-slate-100 border-8 border-white shadow-2xl shadow-slate-200">
                <video 
                  src={item.listingImages?.[0]?.url} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  muted
                  loop
                  onMouseOver={(e) => (e.target).play()}
                  onMouseOut={(e) => (e.target).pause()}
                />
                
                {/* NEW: Room Type Badge on Card */}
                <div className="absolute top-6 left-6 flex gap-2">
                  <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-2xl text-slate-900 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm">
                    <Home size={12} className="text-blue-600" />
                    {item.propertyType || 'Property'}
                  </div>
                </div>

                <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl text-white text-[10px] font-bold uppercase tracking-widest border border-white/10">
                  Virtual Tour
                </div>
              </div>

              <div className="mt-8 px-2 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="max-w-[70%]">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-widest mb-2">
                      <MapPin size={14} /> {item.area || 'Ibadan'}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-tight line-clamp-1">
                      {item.address}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-slate-900 tracking-tighter">
                       {typeof item.rent === 'number' ? `₦${item.rent.toLocaleString()}` : item.rent}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Per Annum</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => window.location.href = `/for-rent/${item.id}`}
                  className="mt-auto w-full py-5 bg-slate-950 text-white rounded-[2rem] font-black text-sm hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredListings.length === 0 && (
          <div className="text-center py-24 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200">
             <SlidersHorizontal className="mx-auto mb-4 text-slate-300" size={48} />
             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No matches found for your search. Check back later we have more listings coming in every day!</p>
             <button 
               onClick={() => {setSearchQuery(""); setPropertyType(""); setMaxPrice("");}}
               className="mt-4 text-blue-600 font-black text-xs uppercase tracking-widest hover:underline"
             >
               Reset Filters
             </button>
          </div>
        )}
      </div>
    </div>
  );
}