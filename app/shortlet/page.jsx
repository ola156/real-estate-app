"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/client";
import { Loader2, MapPin, Search, SlidersHorizontal, Moon, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ShortletListings() {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState("");

  useEffect(() => {
    async function fetchShortlets() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("listing")
          .select("*, listingImages(url)")
          // Assuming you have a 'type' or 'category' column to identify shortlets
          .eq("type", "ShortLet") 
          .eq("active", true)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setListings(data || []);
        setFilteredListings(data || []);
      } catch (err) {
        console.error("Error fetching shortlets:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchShortlets();
  }, []);

  useEffect(() => {
    let result = listings;

    // Filter by Address
    if (searchQuery) {
      result = result.filter((l) =>
        l.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.area?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by Daily Rent Price
    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      result = result.filter((l) => {
        const price = Number(l.rent);
        if (!max) return price >= min;
        return price >= min && price <= max;
      });
    }

    setFilteredListings(result);
  }, [searchQuery, priceRange, listings]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20 md:pt-14 pt-3">
      <div className="max-w-6xl mx-auto px-6">
        
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-[10px] uppercase tracking-widest mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to Home
        </Link>

        {/* Header & Search/Filter Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 p-8 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-sm">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-1">Premium Stays</p>
            <h1 className="text-3xl font-black text-slate-950 tracking-tight">Shortlet <span className="text-blue-600">Apartments</span></h1>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            {/* Address Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder="Search by address..."
                className="pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 w-full md:w-64 shadow-inner"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Price Filter */}
            <select 
              className="px-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-600 outline-none appearance-none cursor-pointer shadow-inner"
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <option value="">Any Price / Day</option>
              <option value="0-30000">Under ₦30k</option>
              <option value="30001-70000">₦30k - ₦70k</option>
              <option value="70001-150000">₦70k - ₦150k</option>
              <option value="150001">Above ₦150k</option>
            </select>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
          {filteredListings.map((item) => (
            <div key={item.id} className="group flex flex-col bg-white rounded-[3rem] overflow-hidden">
              {/* Media Container */}
              <div className="relative aspect-video rounded-[3rem] overflow-hidden bg-slate-100 border-8 border-white shadow-xl group-hover:shadow-2xl transition-all duration-500">
                <video 
                  src={item.listingImages?.[0]?.url} 
                  className="w-full h-full object-cover"
                  muted loop
                  onMouseOver={(e) => e.target.play()}
                  onMouseOut={(e) => e.target.pause()}
                />
                
                <div className="absolute top-6 left-6">
                  <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-2xl text-slate-900 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Moon size={12} className="text-blue-600" />
                    Shortlet
                  </div>
                </div>

                <div className="absolute bottom-6 right-6 bg-slate-200 px-5 py-2 rounded-2xl text-black text-[12px] font-black shadow-lg">
                  ₦{Number(item.rent).toLocaleString()} / Day
                </div>
              </div>

              {/* Text Content */}
              <div className="mt-8 px-4 flex-grow">
                <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-3">
                  <MapPin size={14} className="text-blue-600" /> {item.area || 'Ibadan'}
                </div>
                <h3 className="text-2xl font-black text-slate-950 tracking-tight leading-tight mb-2 uppercase">
                  {item.address}
                </h3>
                <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-6">
                  Experience luxury and comfort in this premium {item.propertyType || 'apartment'}. 
                  Fully serviced and ready for your stay.
                </p>
                
                <button 
                  onClick={() => window.location.href = `/shortlet/${item.id}`}
                  className="w-full py-5 bg-slate-950 text-white rounded-[2rem] font-black text-sm hover:bg-blue-600 transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 group-hover:bg-blue-600"
                >
                  Book This Space
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredListings.length === 0 && (
          <div className="text-center py-32 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200">
             <Home className="mx-auto mb-4 text-slate-200" size={64} />
             <h2 className="text-xl font-black text-slate-900 mb-2">No Shortlets Found</h2>
             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Try adjusting your address search or price range.</p>
          </div>
        )}
      </div>
    </div>
  );
}