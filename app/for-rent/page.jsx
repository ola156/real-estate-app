"use client";

import { useEffect, useState } from "react";
import { supabase } from '@/utils/client' 
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  BedDouble, 
  Loader2, 
  Home, 
  ChevronDown,
  Filter,
  LayoutGrid,
  VerifiedIcon,
  Verified
} from "lucide-react";
import Link from "next/link";




export default function ForRentPage() {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. Filtering States
  const [searchTerm, setSearchTerm] = useState("");
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [roomType, setRoomType] = useState("All");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("listing")
          .select("*")
          .eq("active", true)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setListings(data || []);
        setFilteredListings(data || []);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const parsePrice = (priceStr) => {
    if (typeof priceStr === 'number') return priceStr;
   const clean = priceStr.replace(/[^0-9.-]+/g, "");
    return Number(clean) * (priceStr.toLowerCase().includes('k') ? 1000 : 1);
  };

  // 2. Triple-Filter Logic
  useEffect(() => {
    const results = listings.filter((item) => {
      const matchesSearch = item.address.toLowerCase().includes(searchTerm.toLowerCase());
      const itemPrice = parsePrice(item.totalPackage);
      const matchesPrice = itemPrice <= maxPrice;
      const matchesType = roomType === "All" || item.propertyType === roomType;
      
      return matchesSearch && matchesPrice && matchesType;
    });
    setFilteredListings(results);
  }, [searchTerm, maxPrice, roomType, listings]);

 

  return (
    <div className="min-h-screen bg-white pb-10 ">
      <section className="container mx-auto px-6 mb-16">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter">
              Explore <span className="text-blue-600">Rentals.</span>
            </h1>
          </div>
          
          {/* Enhanced Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Input */}
            <div className="relative md:col-span-6 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <Input
                placeholder="Search location (e.g. Bodija)..."
                className="h-16 pl-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all shadow-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Room Type Filter */}
            <div className="relative md:col-span-3">
              <LayoutGrid className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select 
                className="w-full h-16 pl-12 pr-6 rounded-2xl border-none bg-slate-50 text-slate-600 font-bold text-sm appearance-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
                onChange={(e) => setRoomType(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Room self-contained">Room self-contained</option>
                <option value="Room in a flat">Room in a flat</option>
                <option value="Single Room">Single Room</option>
                <option value="Room and palor self-contained">Room and palor self-contained</option>
                <option value="2 Bed Room">2 Bed Room</option>
                <option value="3 Bed Room">3 Bed Room</option>
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              
            </div>

            {/* Price Filter */}
            <div className="relative md:col-span-3">
              <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select 
                className="w-full h-16 pl-12 pr-6 rounded-2xl border-none bg-slate-50 text-slate-600 font-bold text-sm appearance-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              >
                <option value="10000000">Any Budget</option>
                <option value="200000">₦100k - ₦200k</option>
                <option value="400000">₦200k - ₦400k</option>
                <option value="700000">₦400k - ₦700k</option>
                <option value="1000000">₦700k - ₦1M</option>
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>
      </section>

      {/* Grid Rendering */}
      <section className="container mx-auto px-6 max-w-7xl">
        {loading ? (
          <div className="flex flex-col items-center py-24">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="text-slate-400 italic">Finding the best matches...</p>
          </div>
        ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
  {filteredListings.map((property) => (

<Link href={`/for-rent/${property.id}`} key={property.id}>
  <div 
      className="group cursor-pointer bg-white rounded-[3rem] border border-slate-100 p-4 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-50 hover:-translate-y-2 active:scale-[0.98] flex flex-col"
    >
      {/* 1. Verified Visual Top Area */}
      <div className="bg-slate-50/50 rounded-[2.5rem] h-52 flex items-center justify-center relative overflow-hidden border border-slate-50 mb-8">
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
        
        {/* Center Icon Group */}
        <div className="relative z-10">
          <div className="w-24 h-24 rounded-3xl bg-white shadow-sm flex items-center justify-center text-blue-100 group-hover:scale-110 group-hover:text-blue-200 transition-all duration-500">
            <Home size={60} strokeWidth={1} />
          </div>
          
          {/* Main Verified Badge */}
          {property.active && (
            <div className="absolute top-3 z-10 right-3 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center border-4 border-white shadow-lg">
              <Verified size={14} />
            </div>
          )}
        </div>

        {/* Floating Property Type Badge */}
        <Badge className="absolute bottom-6 right-6 bg-slate-900 text-white border-none px-4 py-1.5 rounded-full font-bold shadow-sm">
          {property.propertyType}
        </Badge>
      </div>

      {/* 2. Content Area */}
      <div className="px-5 flex flex-col flex-grow">
        {/* Address and Area */}
        <div className="flex flex-col mb-8">
          <h3 className="text-sm md:text-xl font-black text-slate-950 tracking-tight group-hover:text-blue-600 transition-colors truncate">
            {property.address}
          </h3>
          <div className="flex items-center text-slate-400 text-xs mt-1.5 font-bold uppercase tracking-widest">
            <MapPin size={12} className="mr-1.5 text-blue-500" /> {property.area || 'Ibadan, Nigeria'}
          </div>
      


       </div>


        {/* Separator Line */}
        <div className="h-px w-full bg-slate-100 mb-6" />

        {/* 3. Pricing Table - The Main transparent feature */}
        <div className="space-y-4 mb-6 flex-grow">
          {/* Rent Row */}
          <div className="flex justify-between items-center text-sm font-medium text-slate-500 pb-3 border-b border-slate-50">
            <span>Base Rent (Per Annum)</span>
            <span className="font-bold text-slate-800">₦ {property.rent}</span>
          </div>
          
          {/* Total Package Row */}
          <div className="flex justify-between items-center bg-slate-800 rounded-2xl p-5 text-white shadow-lg shadow-slate-200">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Package</span>
              <span className="text-[10px] text-slate-500 leading-tight">(Rent + Caution + Agency + Legal)</span>
            </div>
            <span className="text-xl font-black text-blue-400 tracking-tight">₦ {property.totalPackage}</span>
          </div>
        </div>
      </div>
    </div>
</Link>
   
  ))}
</div>
        )}

        {!loading && filteredListings.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
            <p className="text-slate-500 font-medium italic">No matches for this specific search.</p>
            <button 
              onClick={() => {setSearchTerm(""); setMaxPrice(10000000); setRoomType("All");}}
              className="text-blue-600 font-bold mt-2 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}