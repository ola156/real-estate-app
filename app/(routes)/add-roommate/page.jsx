"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '@/utils/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

export default function AddRoommate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // 1. Initialize State (Added gender)
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    budget: "",
    lifestyle: "",
    room_status: "Has a room",
    gender: "Male", // Default value
  });

  // 2. Handle Form Submission
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("roommate_listings")
        .insert([
          {
            name: formData.name,
            location: formData.location,
            budget: formData.budget,
            lifestyle: formData.lifestyle,
            room_status: formData.room_status,
            gender: formData.gender, // Sending gender to DB
            is_active: true,
          },
        ]);

      if (error) throw error;

      alert("Listing posted successfully!");
      router.push("/roommates");
      router.refresh();
    } catch (error) {
      console.error("Error adding listing:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-10 md:pt-28 pb-20 px-6">
      <div className="container mx-auto max-w-2xl">
        
        <Link 
          href="/roommates" 
          className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 mb-8 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Listings
        </Link>

        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-slate-900 text-white p-10">
            <CardTitle className="text-3xl font-black tracking-tighter">
              Post a New <span className="text-blue-400">Match.</span>
            </CardTitle>
            <p className="text-slate-400 text-sm mt-2">
              Fill in the details to find your next roommate.
            </p>
          </CardHeader>

          <CardContent className="p-10 bg-white">
            <form onSubmit={onSubmit} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Your Name</label>
                <Input 
                  required
                  placeholder="e.g. Usman Olayinka"
                  className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Location</label>
                  <Input 
                    required
                    placeholder="e.g. Bodija, Ibadan"
                    className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white"
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Budget</label>
                  <Input 
                    required
                    placeholder="e.g. ₦150k/year"
                    className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white"
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  />
                </div>
              </div>

              {/* Gender and Room Status Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Gender</label>
                  <select 
                    className="w-full h-14 rounded-2xl border border-slate-100 bg-slate-50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Room Status</label>
                  <select 
                    className="w-full h-14 rounded-2xl border border-slate-100 bg-slate-50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    onChange={(e) => setFormData({...formData, room_status: e.target.value})}
                  >
                    <option value="Has a room">I have a room</option>
                    <option value="Needs a room">I need a room</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Lifestyle / Intro</label>
                <Textarea 
                  required
                  placeholder="Tell us about your habits (e.g. I work 9-5, I like a quiet environment, I study late...)"
                  className="min-h-[120px] rounded-2xl border-slate-100 bg-slate-50 focus:bg-white pt-4"
                  onChange={(e) => setFormData({...formData, lifestyle: e.target.value})}
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-16 rounded-2xl text-lg font-bold shadow-xl shadow-blue-100 transition-all flex gap-3"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Send size={20} /> Publish Listing
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}