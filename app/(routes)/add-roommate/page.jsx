"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '@/utils/client';
import { useUser } from "@clerk/nextjs"; // 1. Added Clerk import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import RoommateMediaUpload from "./_components/RoommateMediaUpload";

export default function AddRoommate() {
  const router = useRouter();
  const { user } = useUser(); // 2. Initialized Clerk user hook
  const [loading, setLoading] = useState(false);
  const [profileImg, setProfileImg] = useState("");
  const [roomImages, setRoomImages] = useState([]);
  
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    budget: "",
    lifestyle: "",
    room_status: "Has a room",
    gender: "Male",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user) {
      toast.error("Please sign in to post a listing");
      return;
    }

    setLoading(true);

    try {
      // 3. Insert main listing
      const { data: listing, error: listError } = await supabase
        .from("roommate_listings")
        .insert([{
            ...formData,
            profileImg: profileImg,
            is_active: true,
        }])
        .select()
        .single();

      if (listError) throw listError;

      // 4. Save Room Media if they exist and status is "Has a room"
      if (roomImages.length > 0 && formData.room_status === "Has a room") {
        const mediaToInsert = roomImages.map(img => ({
          url: img.url,
          roommate_listing_id: listing.id 
        }));
        
        const { error: mediaError } = await supabase
          .from("roommate_images")
          .insert(mediaToInsert); // Simplified this line

        if (mediaError) throw mediaError;
      }

      toast.success("Listing posted!");
      router.push("/roommates");
      router.refresh();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Error posting listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 md:py-20 px-4 md:px-6">
      <div className="mx-auto max-w-2xl">
        {/* Navigation */}
        <Link
          href="/roommates"
          className="inline-flex items-center text-xs md:text-sm font-bold text-slate-500 hover:text-blue-600 mb-6 md:mb-8 transition-colors uppercase tracking-widest"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Listings
        </Link>

        <Card className="border-none shadow-2xl shadow-slate-200/60 rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-white">
          <CardHeader className="bg-slate-950 text-white p-8 md:p-12">
            <CardTitle className="text-2xl md:text-4xl font-black tracking-tighter">
              Post a New <span className="text-blue-400">Match.</span>
            </CardTitle>
            <p className="text-slate-400 text-xs md:text-sm mt-2 font-medium">
              Fill in the details to find your next roommate.
            </p>
          </CardHeader>

          <CardContent className="p-6 md:p-12 space-y-10">
            {/* Media Upload Section */}
            <div className="bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-100">
              <RoommateMediaUpload
                showRoomUpload={formData.room_status === "Has a room"}
                onProfileUpload={(url) => setProfileImg(url)}
                onRoomMediaUpload={setRoomImages}
              />
            </div>

            <form onSubmit={onSubmit} className="space-y-8">
              {/* Name */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Your Full Name
                </label>
                <Input
                  required
                  placeholder="e.g. Usman Olayinka"
                  className="h-14 md:h-16 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all font-bold text-slate-900"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Location & Budget */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Location
                  </label>
                  <Input
                    required
                    placeholder="e.g. Bodija, Ibadan"
                    className="h-14 md:h-16 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 font-bold transition-all"
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Budget
                  </label>
                  <Input
                    required
                    placeholder="e.g. ₦150,000"
                    className="h-14 md:h-16 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 font-bold transition-all"
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  />
                </div>
              </div>

              {/* Gender & Room Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Gender
                  </label>
                  <select
                    className="w-full h-14 md:h-16 rounded-2xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all appearance-none cursor-pointer"
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Room Status
                  </label>
                  <select
                    className="w-full h-14 md:h-16 rounded-2xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all appearance-none cursor-pointer"
                    onChange={(e) => setFormData({ ...formData, room_status: e.target.value })}
                  >
                    <option value="Has a room">I have a room</option>
                    <option value="Needs a room">I need a room</option>
                  </select>
                </div>
              </div>

              {/* Lifestyle */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Lifestyle / Intro
                </label>
                <Textarea
                  required
                  placeholder="Tell us about your habits..."
                  className="min-h-[140px] rounded-3xl border-slate-100 bg-slate-50 focus:bg-white pt-4 px-6 text-sm md:text-base font-medium leading-relaxed transition-all"
                  onChange={(e) => setFormData({ ...formData, lifestyle: e.target.value })}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-slate-950 text-white h-16 md:h-20 rounded-[2rem] text-lg font-black shadow-2xl shadow-blue-200 transition-all flex gap-3 mt-4"
              >
                {loading ? <Loader2 className="animate-spin" /> : <><Send size={20} /> Publish Match Request</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}