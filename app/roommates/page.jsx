"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  MapPin,
  MessageCircle,
  Loader2,
  Plus,
  Trash2,
  X,
  Video,
  Maximize2,
  AlertCircle,
  Sparkle,
  Sparkles,
} from "lucide-react";
import { Show, useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

export default function RoommatePage() {
  const { user } = useUser();
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [previewImgId, setPreviewImgId] = useState(null);

  useEffect(() => {
    fetchRoommates();
  }, []);

  const fetchRoommates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("roommate_listings")
        .select(`*, roommate_images (*)`)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRoommates(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  // --- UPDATED DELETE LOGIC (TOAST CONFIRMATION) ---
  const confirmDelete = (id) => {
    toast("Eliminate this listing?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: () => executeDelete(id),
      },
      cancel: {
        label: "Cancel",
        onClick: () => console.log("Cancelled"),
      },
    });
  };

  const executeDelete = async (id) => {
    try {
      const { error } = await supabase
        .from("roommate_listings")
        .delete()
        .eq("id", id);
      if (error) throw error;

      setRoommates((prev) => prev.filter((item) => item.id !== id));
      toast.success("Listing removed successfully");
    } catch (err) {
      toast.error("Error deleting listing");
    }
  };

  const contactOnWhatsApp = (name, location) => {
    const myNumber = "+2348087442174";
    const text = `Hi! I saw the roommate listing for ${name} in ${location} and I'm interested in pairing up.`;
    window.open(
      `https://wa.me/${myNumber}?text=${encodeURIComponent(text)}`,
      "_blank",
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20 px-4">
  <section className="container mx-auto max-w-7xl">
    {/* --- HERO HEADER --- */}
    <section className="container mx-auto max-w-7xl text-center mb-16">
      <h1 className="text-3xl md:text-6xl font-black text-slate-950 tracking-tighter mb-6 leading-[0.9]">
        Find your <span className="text-blue-600">Perfect Match.</span>
      </h1>

      <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed font-medium mb-10">
        Skip the stress. Browse verified profiles or list your space to find
        a compatible roommate in Ibadan today.
      </p>

      <Link href="/roommates/add">
        <Button className="bg-blue-600 hover:bg-slate-950 text-white h-16 px-10 rounded-[2rem] font-bold shadow-2xl shadow-blue-100 flex items-center gap-3 mx-auto transition-all hover:scale-105 active:scale-95">
          <Plus size={20} /> List Your Profile
        </Button>
      </Link>
    </section>

    {/* --- NEW UPDATED ACTIVE LISTINGS BAR --- */}
    {!loading && roommates.length > 0 && (
      <div className="flex items-center justify-between mb-8 px-4 py-6 border-b border-slate-200">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase">
          Active Listings
        </h2>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-[12px] font-black shadow-lg shadow-blue-100">
            <Sparkles size={14} />
            {roommates.length} Matches Found
          </div>
        </div>
      </div>
    )}

    {loading ? (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {roommates.map((person) => {
          const hasVideo = person.roommate_images?.find(
            (img) => img.url.includes("video") || img.url.endsWith(".mp4"),
          );
          const isPlaying = playingVideoId === person.id;
          const isPreviewingImg = previewImgId === person.id;
          const isOwner = user?.primaryEmailAddress?.emailAddress === person.createdBy;

          return (
            <div
              key={person.id}
              className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative h-64 bg-slate-100">
                {/* Delete Action (Toast Trigger) */}
                {!isPlaying && !isPreviewingImg && (
                  <Show when="signed-in">
                    <button
                      onClick={() => confirmDelete(person.id)}
                      className="absolute top-4 left-4 z-20 p-2 bg-white/80 backdrop-blur-sm text-slate-400 hover:text-red-500 rounded-xl transition-all shadow-sm"
                    >
                      <Trash2 size={18} />
                    </button>
                  </Show>
                )}

                {isPlaying && hasVideo ? (
                  <div className="relative h-full w-full bg-black">
                    <video
                      src={hasVideo.url}
                      autoPlay
                      controls
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={() => setPlayingVideoId(null)}
                      className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-red-500 transition-colors z-30"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : isPreviewingImg ? (
                  <div className="relative h-full w-full bg-slate-900">
                    {person.profileImg && (
                      <Image
                        src={person.profileImg}
                        alt={person.name}
                        fill
                        className="object-contain"
                      />
                    )}
                    <button
                      onClick={() => setPreviewImgId(null)}
                      className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white p-2 rounded-full hover:bg-blue-600 transition-colors z-30"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="relative h-full w-full">
                    {person.roommate_images?.[0] ? (
                      <Image
                        src={person.roommate_images[0].url}
                        alt=""
                        fill
                        className="object-cover opacity-30"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white" />
                    )}

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <button
                        onClick={() => setPreviewImgId(person.id)}
                        className="group relative w-24 h-24 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white mb-3 transition-transform hover:scale-105 active:scale-95"
                      >
                        {person.profileImg ? (
                          <>
                            <Image
                              src={person.profileImg}
                              alt={person.name}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Maximize2 size={20} className="text-white" />
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-200">
                            <User size={40} />
                          </div>
                        )}
                      </button>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">
                        {person.name}
                      </h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <MapPin size={12} className="text-blue-500" />{" "}
                        {person.location}
                      </p>
                    </div>

                    {hasVideo && (
                      <button
                        onClick={() => {
                          setPreviewImgId(null);
                          setPlayingVideoId(person.id);
                        }}
                        className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-black text-[10px] uppercase shadow-lg hover:bg-slate-950 transition-all animate-bounce"
                      >
                        <Video size={14} /> Room Tour
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="p-8">
                <div className="flex gap-2 mb-6">
                  <Badge className="bg-slate-900 text-white border-none px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-wider">
                    {person.room_status}
                  </Badge>
                  <Badge className="bg-blue-50 text-blue-600 border-none px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-wider">
                    {person.gender}
                  </Badge>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 mb-8 border border-slate-100 min-h-[80px]">
                  <p className="text-slate-600 text-sm leading-relaxed font-medium line-clamp-2 italic">
                    "{person.lifestyle}"
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                      Budget
                    </span>
                    <span className="text-2xl font-black text-slate-900 tracking-tighter">
                      ₦ {Number(person?.budget || 0).toLocaleString()}{" "}
                      <span className="text-xs tracking-normal text-primary">
                        Per Person
                      </span>
                    </span>
                  </div>
                  <Button
                    onClick={() =>
                      contactOnWhatsApp(person.name, person.location)
                    }
                    className="bg-blue-600 hover:bg-slate-950 text-white rounded-2xl h-14 px-8 font-black flex items-center gap-3 transition-all shadow-lg shadow-blue-100"
                  >
                    <MessageCircle size={20} /> Chat
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </section>
</div>
  );
}
