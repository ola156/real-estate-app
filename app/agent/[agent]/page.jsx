"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/client";
import { Loader2, MapPin, Search, User, ArrowLeft, SlidersHorizontal, Home, Moon } from "lucide-react";
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
  const [category, setCategory] = useState("All"); 

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

    // Filter by Rent/Sale/Shortlet Category
    if (category !== "All") {
      result = result.filter((l) => l.type === category);
    }

    if (searchQuery) {
      result = result.filter((l) => 
        l.area?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        l.address?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (propertyType) {
      result = result.filter((l) => l.propertyType?.trim() === propertyType);
    }

    if (maxPrice) {
      const [min, max] = maxPrice.split("-").map(Number);
      result = result.filter((l) => {
        // Use rent for Rent/Shortlet items, totalPackage for Sale items
        const priceValue = l.type === "Sale" ? (l.totalPackage || 0) : (l.rent || 0);
        const numericPrice = typeof priceValue === 'number' ? priceValue : parseInt(String(priceValue).replace(/[^0-9]/g, ""), 10);
        
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

  return (
    <div className="min-h-screen bg-white pb-20 md:pt-10 pt-1">
      <div className="max-w-6xl mx-auto px-6">
        
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-[10px] uppercase tracking-widest mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to Home
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

          <div className="flex flex-col gap-4">
            {/* UPDATED: Added Shortlet to Radio Filter Group */}
            <div className="flex bg-white p-1 rounded-2xl border border-slate-200 w-fit self-end overflow-x-auto max-w-full">
              {["All", "Rent", "Sale", "Shortlet"].map((option) => (
                <button
                  key={option}
                  onClick={() => setCategory(option)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    category === option 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                    : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text"
                  placeholder="Search area..."
                  className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 w-full lg:w-48 shadow-inner"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <select 
                  className="px-3 py-3 bg-white border border-slate-200 rounded-2xl text-[12px] md:text-sm font-medium focus:ring-2 focus:ring-blue-600 outline-none w-full appearance-none shadow-inner"
                  onChange={(e) => setPropertyType(e.target.value)}
                  value={propertyType}
                >
                  <option value="">All Types</option>
                  <option value="Room self-contained">Room self-contained</option>
                  <option value="Room in a flat">Room in a flat</option>
                  <option value="Single Room">Single Room</option>
                  <option value="Room and palor self-contained">Room and palor self-contained</option>
                  <option value="1 Bed Room">1 Bed Room</option>
                  <option value="2 Bed Room">2 Bed Room</option>
                  <option value="3 Bed Room">3 Bed Room</option>
                  <option value="Land">Land</option>
                </select>

                <select 
                  className="px-3 py-3 bg-white border border-slate-200 rounded-2xl text-[12px] md:text-sm font-medium focus:ring-2 focus:ring-blue-600 outline-none w-full appearance-none shadow-inner"
                  onChange={(e) => setMaxPrice(e.target.value)}
                  value={maxPrice}
                >
                  <option value="">All Prices</option>
                  <option value="0-50000">Under ₦50k</option>
                  <option value="50001-200000">₦50k - ₦200k</option>
                  <option value="200001-600000">₦200k - ₦600k</option>
                  <option value="600001-1500000">₦600k - ₦1.5M</option>
                  <option value="1500001">Above ₦1.5M</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
          {filteredListings.map((item) => (
            <div key={item.id} className="group flex flex-col">
              <div className="relative aspect-video rounded-[3rem] overflow-hidden bg-slate-100 border-8 border-white shadow-2xl shadow-slate-200">
                <video 
                  src={item.listingImages?.[0]?.url} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  muted loop
                  onMouseOver={(e) => (e.target).play()}
                  onMouseOut={(e) => (e.target).pause()}
                  playsInline
                />
                
                <div className="absolute top-6 left-6 flex gap-2">
                  <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-2xl text-slate-900 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm">
                    {item.type === "Shortlet" ? <Moon size={12} className="text-blue-600" /> : <Home size={12} className="text-blue-600" />}
                    {item.propertyType === "Room and palor self-contained" ? "Room & palor self-con" : item.propertyType}
                  </div>
                </div>

                <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl text-white text-[10px] font-bold uppercase tracking-widest border border-white/10">
                  {item.type === "Rent" ? "For Rent" : item.type === "Sale" ? "For Sale" : "Shortlet"}
                </div>
              </div>

              <div className="mt-8 px-2 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="max-w-[70%]">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-widest mb-2">
                      <MapPin size={14} /> {item.area || 'Ibadan'}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-tight line-clamp-1 uppercase">
                      {item.address}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-slate-900 tracking-tighter">
                       {item.type === "Sale" 
                         ? (typeof item.totalPackage === 'number' ? `₦${item.totalPackage.toLocaleString()}` : item.totalPackage)
                         : (typeof item.rent === 'number' ? `₦${item.rent.toLocaleString()}` : item.rent)
                       }
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                      {item.type === "Sale" ? "Asking Price" : item.type === "ShortLet" ? "Per Night" : "Per Annum"}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    const route = item.type === "Sale" ? "for-sale" : item.type === "ShortLet" ? "shortlet" : "for-rent";
                    window.location.href = `/${route}/${item.id}`;
                  }}
                  className="mt-auto w-full py-5 bg-slate-950 text-white rounded-[2rem] font-black text-sm hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
                >
                  {item.type === "Shortlet" ? "Book This Space" : "View Details"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredListings.length === 0 && (
          <div className="text-center py-24 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200">
             <SlidersHorizontal className="mx-auto mb-4 text-slate-300" size={48} />
             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No matches found for your search.</p>
             <button 
               onClick={() => {setSearchQuery(""); setPropertyType(""); setMaxPrice(""); setCategory("All");}}
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