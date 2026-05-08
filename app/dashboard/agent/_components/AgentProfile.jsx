"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/client";
import { Formik } from "formik";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader, User, Building2, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

function AgentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (values) => {
    setUpdating(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("profiles")
      .update({
        agency_name: values.agencyName,
        phoneNo: values.phone,
        full_name: values.fullName,
        // email is usually kept in auth.users, but if you have it in profiles:
        email: values.email 
      })
      .eq("id", user.id);

    if (error) {
      toast.error("Update failed: " + error.message);
    } else {
      toast.success("Profile updated successfully!");
      fetchProfile();
    }
    setUpdating(false);
  };

  if (loading) return <div className="flex justify-center p-20"><Loader className="animate-spin text-blue-600" /></div>;

  return (
    <div className="px-2 pt-5 md:px-20 lg:px-60 py-8 bg-[#FDFDFD] min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h2 className="font-black text-2xl text-slate-900 tracking-tight">Agent Profile</h2>
          <p className="text-slate-500 font-medium">Manage your agency identity and contact details.</p>
        </div>

        <Formik
          enableReinitialize={true}
          initialValues={{
            fullName: profile?.full_name || "",
            agencyName: profile?.agency_name || "",
            email: profile?.email || "",
            phone: profile?.phoneNo || "",
          }}
          onSubmit={updateProfile}
        >
          {({ values, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit} className="p-7 md:p-12 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 bg-white space-y-8">
              
              <div className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-bold text-slate-700">
                    <User size={16} className="text-blue-600" /> Full Name
                  </Label>
                  <Input 
                    name="fullName" 
                    value={values.fullName} 
                    onChange={handleChange} 
                    className="h-14 rounded-2xl bg-slate-50 border-none px-6" 
                  />
                </div>

                {/* Agency Name */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-bold text-slate-700">
                    <Building2 size={16} className="text-blue-600" /> Agency Name
                  </Label>
                  <Input 
                    name="agencyName" 
                    value={values.agencyName} 
                    onChange={handleChange} 
                    className="h-14 rounded-2xl bg-slate-50 border-none px-6" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 font-bold text-slate-700">
                      <Mail size={16} className="text-blue-600" /> Email Address
                    </Label>
                    <Input 
                      name="email" 
                      type="email"
                      value={values.email} 
                      onChange={handleChange} 
                      className="h-14 rounded-2xl bg-slate-50 border-none px-6" 
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 font-bold text-slate-700">
                      <Phone size={16} className="text-blue-600" /> Phone Number
                    </Label>
                    <Input 
                      name="phone" 
                      value={values.phone} 
                      onChange={handleChange} 
                      className="h-14 rounded-2xl bg-slate-50 border-none px-6" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button 
                  type="submit" 
                  disabled={updating}
                  className="h-16 px-12 rounded-2xl font-black uppercase text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200"
                >
                  {updating ? <Loader className="animate-spin" /> : "Update Profile"}
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default AgentProfile;