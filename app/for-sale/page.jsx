"use client";

import { useEffect, useState } from "react";
import { supabase } from '@/utils/client';
import { Loader2, MapPin, Sparkles, Tag, ArrowUpRight, Search, Filter } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function ForSalePage() {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState("all");

  useEffect(() => {
    fetchForSaleListings();
  }, []);

  // Handle Filtering Logic
  useEffect(() => {
    let result = listings;

    if (searchTerm) {
      result = result.filter(item => 
        item.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.propertyType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      result = result.filter(item => {
        const price = Number(item.totalPackage);
        if (max) return price >= min && price <= max;
        return price >= min; // For "1000000+"
      });
    }

    setFilteredListings(result);
  }, [searchTerm, priceRange, listings]);

  const fetchForSaleListings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("listing") 
        .select(`*, listingImages (*)`)
        .eq("type", 'Sale') 
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setListings(data || []);
      setFilteredListings(data || []);
    } catch (err) {
      toast.error("Error fetching properties");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-3 pb-20 px-4 md:px-10">
      {/* --- SEARCH & FILTER BAR --- */}
      <section className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row gap-4 items-center bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by address or property type..."
              className="w-full h-14 pl-12 pr-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 bg-white font-medium text-slate-900"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <Filter className="text-slate-400 hidden md:block" size={18} />
            <select 
              className="h-14 px-6 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 bg-white font-bold text-slate-600 cursor-pointer w-full md:w-64"
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <option value="all">Any Price</option>
              <option value="0-500000">Below ₦500k</option>
              <option value="500000-1000000">₦500k - ₦1M</option>
              <option value="1000000-5000000">₦1M - ₦5M</option>
              <option value="5000000-10000000">₦5M - ₦10M</option>
              <option value="10000000">₦10M +</option>
            </select>
          </div>
        </div>
      </section>

      {/* --- GRID SECTION --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredListings.map((item) => {
            const videoAsset = item.listingImages?.find(img => 
              img.url.includes("video") || img.url.endsWith(".mp4")
            );

            return (
              <div key={item.id} className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 transition-all duration-500 hover:shadow-2xl">
                <div className="relative h-[420px] w-full bg-slate-900 overflow-hidden">
                  {videoAsset ? (
                    <video src={videoAsset.url} autoPlay muted loop playsInline className="h-full w-full object-cover opacity-80" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center"><Sparkles className="text-slate-200" size={48} /></div>
                  )}
                  
                  <div className="absolute top-6 right-6 bg-white/95 px-6 py-3 rounded-2xl shadow-xl z-10 border border-white">
                    <span className="text-[9px] font-black text-blue-600 uppercase block mb-1">Asking Price</span>
                    <span className="text-xl font-black text-slate-900">₦{Number(item.totalPackage || 0).toLocaleString()}</span>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-slate-950 text-white">
                    <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">
                      <MapPin size={20} className="text-blue-400" /> {item.address}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black tracking-tight uppercase italic">{item.propertyType}</h3>
                  </div>
                </div>

                <div className="p-8 bg-white">
                  <Link href={`/for-sale/${item.id}`} className="block">
                    <button className="w-full p-3 bg-slate-950 hover:bg-blue-600 text-white rounded-[1.5rem] h-16 font-black flex items-center justify-center gap-3 transition-all shadow-xl">
                     <p> VIEW PROPERTY DETAILS</p>
                      <ArrowUpRight size={20} />
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}