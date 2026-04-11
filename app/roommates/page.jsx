"use client";

import { useEffect, useState } from "react";
import { supabase } from '@/utils/client' // Ensure this points to your Supabase config
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, MessageCircle, Loader2, Plus , Sparkles} from "lucide-react";

export default function RoommatePage() {
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch data from your 'roommate_listings' table
  useEffect(() => {
    const fetchRoommates = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("roommate_listings")
          .select("*")
          .eq("is_active", true) // Only show active listings
          .order("created_at", { ascending: false });

        if (error) throw error;
        setRoommates(data || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoommates();
  }, []);

  // 2. Dynamic WhatsApp message generator
  const contactOnWhatsApp = (name, location) => {
    const myNumber = "+2348087442174"; // Replace with your actual number
    const text = `Hi! I saw the roommate listing for ${name} in ${location} and I'm interested in pairing up.`;
    window.open(`https://wa.me/${myNumber}?text=${encodeURIComponent(text)}`, "_blank");
  };

   const handleListRoom = () => {
    const phone = "+2348087442174"; // Replace with your number
    const msg = encodeURIComponent("Hi! I have a room and I'm looking for a roommate to pair with. Can you help me list it?");
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-white pt-5 md:pt-15 pb-20">
      {/* Sleek Hero Header */}
  
      <section className="container mx-auto px-6 mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6">
          <Sparkles size={14} /> Live Community Listings
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-950 tracking-tighter mb-6">
          Find your <span className="text-blue-600">Perfect Match.</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
           Need a roommate? Browse verified profiles or reach out to list your space and find someone to pair with.
        </p>
         <Button 
            onClick={handleListRoom}
            className="bg-blue-600 hover:bg-blue-700 text-white h-14 px-8 my-4 rounded-full font-bold shadow-lg shadow-blue-100 flex items-center gap-2 mx-auto transition-transform hover:scale-105"
          >
            <Plus size={20} />
            List Your Room
          </Button>
      </section>
      <section className="container mx-auto px-6 max-w-6xl">
        {loading ? (
          // Loading State
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-slate-400 font-medium italic">Loading latest matches...</p>
          </div>
        ) : roommates.length === 0 ? (
          // Empty State
          <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[3rem]">
            <p className="text-slate-400">No listings found. Be the first to post!</p>
          </div>
        ) : (
          // The Data Grid
         <div className="py-16 container mx-auto ">
              <div className="flex justify-between items-center mb-10">
          <h2 className="text-sm md:text-2xl font-bold text-slate-900">Active Listings</h2>
          <div className="text-[10px] md:text-sm text-blue-600 font-semibold uppercase  tracking-widest">
          
             {roommates.length} Matches available
          
          </div>
        </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
            {roommates.map((person) => (
              <div 
                key={person.id} 
                className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-100/50 hover:-translate-y-2"
              >
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <User size={28} />
                  </div>
                  <Badge className="bg-blue-50 text-blue-600 border-none px-4 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider">
                    {person.room_status}
                  </Badge>
                </div>

                {/* Name & Location */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">{person.name}</h3>
                  <div className="flex items-center text-slate-400 text-sm font-medium">
                    <MapPin size={16} className="mr-1.5 text-blue-500" /> {person.location}
                  </div>
                </div>

                {/* Info Box */}
                <div className="space-y-4 mb-10">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Yearly Budget</span>
                    <span className="text-xl font-black text-blue-600 tracking-tight">{person.budget}</span>
                  </div>
                  <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-50">
                    <p className="text-slate-600 text-sm leading-relaxed italic line-clamp-3">
                      "{person.lifestyle}"
                    </p>
                  </div>
                </div>

                {/* Connect Action */}
                <Button 
                  onClick={() => contactOnWhatsApp(person.name, person.location)}
                  className="w-full h-14 rounded-2xl bg-slate-950 hover:bg-blue-600 text-white font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-slate-200"
                >
                  <MessageCircle size={20} />
                 Link Up Now
                </Button>
              </div>
            ))}
          </div>
         </div>
        )}
      </section>
    </div>
  );
}