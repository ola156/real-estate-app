"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/client";
import { Loader2, MapPin, Video, User, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AgentListings() {
  const { agent } = useParams();
  const agentName = decodeURIComponent(agent);

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } catch (err) {
        console.error("Error fetching agent listings:", err);
      } finally {
        setLoading(false);
      }
    }
    if (agentName) fetchAgentProperties();
  }, [agentName]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20 md:pt-24 pt-10">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Navigation */}
        <Link href="/for-rent" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-[10px] uppercase tracking-widest mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to Search
        </Link>

        {/* Agent Header */}
        <div className="flex items-center gap-6 mb-16 p-8 bg-slate-50 rounded-[3rem] border border-slate-100">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
            <User size={40} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-1">Verified Agent</p>
            <h1 className="text-3xl font-black text-slate-950 tracking-tight">{agentName}</h1>
            <p className="text-slate-500 font-medium text-sm">{listings.length} Properties Available</p>
          </div>
        </div>

        {/* Responsive Grid Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
          {listings.map((item) => (
            <div key={item.id} className="group flex flex-col">
              {/* Video Preview */}
              <div className="relative aspect-video rounded-[3rem] overflow-hidden bg-slate-100 border-8 border-white shadow-2xl shadow-slate-200">
                <video 
                  src={item.listingImages?.[0]?.url} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  muted
                  loop
                  onMouseOver={(e) => (e.target).play()}
                  onMouseOut={(e) => (e.target).pause()}
                />
                <div className="absolute top-6 right-6 bg-black/20 backdrop-blur-md px-4 py-2 rounded-2xl text-white text-[10px] font-bold uppercase tracking-widest border border-white/10">
                  Virtual Tour
                </div>
              </div>

              {/* Info Block */}
              <div className="mt-8 px-2 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="max-w-[70%]">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-widest mb-2">
                      <MapPin size={14} /> {item.area || 'Ibadan Nigeria'}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-tight">
                      {item.address}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-slate-900">{item.rent}</p>
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
        {listings.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
             <p className="text-slate-400 font-bold">This agent has no active listings.</p>
          </div>
        )}
      </div>
    </div>
  );
}