'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/utils/client';
import { Loader, MapPin, ChevronRight, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

function AddNewListing() {
  const [selectedAddress, setSelectedAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const nextHandler = async () => {
    setLoading(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        toast.error("Please login to continue");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("listing")
        .insert([{
          address: selectedAddress,
          user_id: user.id,
          createdBy: user.email
        }])
        .select();

      if (data) {
        toast.success('Listing created! Let’s add the details.');
        router.replace(`/edit-listing/${data[0].id}`);
      } else {
        throw error;
      }
    } catch (error) {
      toast.error('Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-2 lg:p-10 bg-[#FDFDFD]">
      <div className="w-full max-w-xl animate-in fade-in zoom-in duration-500">
        
        {/* Decorative Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-50 p-5 rounded-[2rem] border border-blue-100 shadow-sm">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
        </div>

        {/* Header Section */}
        <div className="text-center mb-5">
          <h2 className="font-black text-xl lg:text-2xl text-slate-900 tracking-tight mb-3">
            List Your Property
          </h2>
          <p className="text-slate-500 font-medium text-sm max-w-sm mx-auto">
            Provide the location to get started. You can add photos and pricing in the next step.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-5 lg:p-8 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-50" />
          
          <div className="space-y-8 relative z-10">
            <div>
              <label className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 mb-4 block ml-1">
                Property Address
              </label>
              
              <div className="group flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-2xl p-1 px-5 transition-all focus-within:bg-white focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-50">
                <MapPin className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                  placeholder="Street name, Area, City..." 
                  className="border-none bg-transparent shadow-none focus-visible:ring-0 text-slate-900 font-bold placeholder:font-normal placeholder:text-slate-400 h-12"
                  onChange={(e) => setSelectedAddress(e.target.value)} 
                />
              </div>
            </div>

            <Button
              disabled={!selectedAddress || loading}
              onClick={nextHandler}
              className="w-full h-15 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-50 flex gap-2"
            >
              {loading ? (
                <Loader className="animate-spin h-5 w-5" />
              ) : (
                <>
                  Continue <ChevronRight size={18} />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Footer Hint */}
        <p className="text-center mt-8 text-slate-400 text-xs font-bold uppercase tracking-widest">
          Step 1 of 2: Location
        </p>
      </div>
    </div>
  );
}

export default AddNewListing;