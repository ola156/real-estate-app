"use client";
import React, { useState, useEffect } from "react";
import { Trash2, Edit3, Loader2, Search, MapPin, Video, Image as ImageIcon, ChevronRight, X } from "lucide-react";
import { supabase } from "@/utils/client";
import Link from "next/link";
import { toast } from "sonner";

export default function DashboardListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
    async function fetchUserListings() {
      try {
        setLoading(true);
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) return;

        const { data, error } = await supabase
          .from("listing")
          .select("*, listingImages(url, listing_id)")
          .eq("user_id", user.id) 
          .order("created_at", { ascending: false });

        if (error) throw error;
        setListings(data || []);
      } catch (error) {
        console.error("Error:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserListings();
  }, []);

  const filteredListings = listings.filter((listing) =>
    listing.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (listingId) => {
    const confirmDelete = toast("Are you sure? This listing will be deleted.");
    if (!confirmDelete) return;

    const { error } = await supabase.from("listing").delete().eq("id", listingId);

    if (error) {
      toast.error("Error deleting listing");
    } else {
      setListings(listings.filter((item) => item.id !== listingId));
      toast.success("Listing deleted successfully.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <Loader2 className="animate-spin mb-2 text-blue-600" size={32} />
        <p className="text-xs font-bold uppercase tracking-widest">Refreshing Portfolio</p>
      </div>
    );
  }

  return (
    <div className="animate-in p-5 fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">My Properties</h3>
          <p className="text-slate-500 font-medium">Viewing {filteredListings.length} results</p>
        </div>

        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search by address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all shadow-sm"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-red-500 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {filteredListings.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-20 text-center">
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-2">
            {searchTerm ? "No matching addresses found" : "No listings found"}
          </p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="text-blue-600 font-black text-sm hover:underline"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredListings.map((listing) => {
            const firstMedia = listing.listingImages?.[0]?.url;
            const isVid = isVideo(firstMedia);

            return (
              <div 
                key={listing.id} 
                className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
              >
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  {firstMedia ? (
                    isVid ? (
                      <video 
                        src={firstMedia} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        muted
                        loop
                        playsInline
                        onMouseOver={e => e.target.play()}
                        onMouseOut={e => { e.target.pause(); e.target.currentTime = 0; }}
                      />
                    ) : (
                      <img 
                        src={firstMedia} 
                        alt={listing.address}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    )
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-200">
                      <ImageIcon size={48} />
                    </div>
                  )}
                  
                  {/* Media Type Icon Overlay */}
                  <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    {isVid ? <Video size={16} /> : <ImageIcon size={16} />}
                  </div>

                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl">
                     <p className="text-blue-600 font-black text-sm">
                       ₦{Number(listing.rent || listing.totalPackage).toLocaleString()}
                     </p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2">
                    <MapPin size={12} className="text-blue-600" /> {listing.area || 'Ibadan'}
                  </div>
                  <h4 className="font-black text-slate-900 text-lg mb-6 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {listing.address}
                  </h4>

                  <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
                    <Link href={`/edit-listing/${listing.id}`} className="flex-1">
                      <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-50 text-slate-600 font-bold text-xs hover:bg-slate-900 hover:text-white transition-all">
                        <Edit3 size={14} /> Edit
                      </button>
                    </Link>
                    <button 
                      onClick={() => handleDelete(listing.id)}
                      className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                    {/* Dynamic link based on property type if necessary */}
                    <Link href={`/for-rent/${listing.id}`}>
                      <button className="p-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                        <ChevronRight size={18} />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}