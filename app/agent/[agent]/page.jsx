"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/client";
import { Loader2, MapPin, Video, Calendar, User } from "lucide-react";

export default function AgentListings() {
  const { agent } = useParams();
  // Decode the URL name (e.g., "Agboola%20Usman" -> "Agboola Usman")
  const agentName = decodeURIComponent(agent);
  console.log("Agent Name from URL:", agentName);

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAgentProperties() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("listing")
          .select("*, listingImages(url)")
          .eq("agent", agentName) // Ensure this column name matches your DB
          .eq("active", true) // Only show published listings to the public
          .order("created_at", { ascending: false });

        if (error) throw error;
        setListings(data || []);
      } catch (err) {
        console.error("Error fetching agent listings:", err);
      } finally {
        setLoading(false);
      }
    }
    if (agentName) fetchAgentProperties();
  }, [agentName]);
 
  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20 md:pt-24 pt-4">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Agent Header */}
        <div className="flex items-center gap-6 mb-16 p-8 bg-slate-50 rounded-[3rem]">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
            <User size={40} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-1">Verified Agent</p>
            <h1 className="text-3xl font-black text-slate-950 tracking-tight">{agentName}</h1>
            <p className="text-slate-500 font-medium text-sm">{listings.length} Properties Available</p>
          </div>
        </div>

        {/* Listings Feed */}
        <div className="flex flex-col gap-12">
          {listings.map((item) => (
            <div key={item.id} className="group overflow-hidden">
              {/* Video Preview */}
              <div className="relative aspect-video rounded-[3rem] overflow-hidden bg-slate-100 border-8 border-white shadow-2xl shadow-slate-200">
                <video 
                  src={item.listingImages?.[0]?.url} 
                  className="w-full h-full object-cover"
                  muted
                  loop
                  onMouseOver={(e) => (e.target).play()}
                  onMouseOut={(e) => (e.target).pause()}
                />
                <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl text-white text-[10px] font-bold uppercase tracking-widest">
                  Virtual Tour
                </div>
              </div>

              {/* Info */}
              <div className="mt-8 px-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-widest mb-2">
                      <MapPin size={14} /> {item.area || 'Ibadan Nigeria'}
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">
                      {item.address}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-slate-900">{item.rent}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Per Annum</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => window.location.href = `/for-rent/${item.id}`}
                  className="w-[90%] py-5 bg-slate-950 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all active:scale-95"
                >
                  View Details & Contact Agent
                </button>
              </div>
            </div>
          ))}

          {listings.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
               <p className="text-slate-400 font-bold">This agent has no active listings.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}