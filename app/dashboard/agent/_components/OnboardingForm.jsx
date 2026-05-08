"use client";
import { useState } from "react";
import { supabase } from "@/utils/client";

export default function OnboardingForm({ user, onComplete }) {
  const [agencyName, setAgencyName] = useState("");
  const [phoneNo, setPhoneNo] = useState(""); // New state for Phone Number
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // This creates the row in your 'profiles' table
    const { error } = await supabase.from('profiles').upsert({
      id: user.id, 
      agency_name: agencyName,
      phoneNo: phoneNo, // Ensure this matches your DB column name exactly
    });

    if (error) {
      alert("Database Error: " + error.message);
      setLoading(false);
    } else {
      onComplete(); // Refreshes the dashboard
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="bg-white p-7 rounded-[2.5rem] shadow-xl max-w-md w-full border border-slate-100">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Setup Agency</h2>
          <p className="text-slate-500 font-medium">Complete your profile to manage listings.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Agency Name Field */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Agency Name</label>
            <input 
              required
              className="w-full mt-1 p-4 rounded-2xl bg-slate-50 border-none outline-blue-600 font-bold text-slate-900"
              placeholder="e.g. Olayinka Properties"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
            />
          </div>

          {/* Phone Number Field */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Phone Number</label>
            <input 
              required
              type="tel"
              className="w-full mt-1 p-4 rounded-2xl bg-slate-50 border-none outline-blue-600 font-bold text-slate-900"
              placeholder="e.g. 08012345678"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-2xl font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? "Creating Profile..." : "Finish Setup"}
          </button>
        </form>
      </div>
    </div>
  );
}