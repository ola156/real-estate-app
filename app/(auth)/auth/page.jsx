"use client";
import { useState } from "react";
import { supabase } from "@/utils/client";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail, ShieldCheck, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminAuth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAdminAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // --- ADMIN SIGN UP ---
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { user_role: "admin" }, // Sets metadata for your trigger
            emailRedirectTo: `${window.location.origin}/dashboard/admin`,
          },
        });
        if (error) throw error;
        toast.success("Admin request sent! Please verify your email.");
      } else {
        // --- ADMIN SIGN IN ---
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Verify they actually have the admin role in your profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (profile?.role !== "admin") {
          await supabase.auth.signOut();
          throw new Error("Unauthorized: Access restricted to administrators.");
        }

        toast.success("Welcome back, Admin");
        router.push("/dashboard/admin"); // Adjust to your actual admin route
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] p-6 mt-5">
      <div className="w-full max-w-md space-y-8">
        {/* Branding Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[2rem] bg-slate-950 text-white shadow-2xl shadow-slate-200">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {isSignUp ? "Create Admin" : "Admin Portal"}
            </h1>
            <p className="text-slate-500 font-medium">Secure access for Instrict management</p>
          </div>
        </div>

        {/* Auth Card */}
        <form onSubmit={handleAdminAuth} className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <Input 
                  type="email" 
                  required
                  placeholder="admin@instrict.com"
                  className="h-14 pl-12 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-slate-900 transition-all"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <Input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="h-14 pl-12 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-slate-900 transition-all"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-slate-950 hover:bg-blue-600 text-white font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-slate-200"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <span className="flex items-center gap-2">
                {isSignUp ? "Register Admin" : "Authorize Session"} <ArrowRight size={16} />
              </span>
            )}
          </Button>

          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
          >
            {isSignUp ? "Already an admin? Log in" : "Need a new admin account? Register"}
          </button>
        </form>
      </div>
    </div>
  );
}