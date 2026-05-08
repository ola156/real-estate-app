"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/utils/client";
import { Loader2, ArrowLeft, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get("role") || "admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = isSignUp 
      ? await supabase.auth.signUp({ email, password, options: { data: { user_role: role } } })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) toast.error(error.message);
    else if (isSignUp) {
       toast.success("Sign-up successful!");
       router.push("/dashboard/agent");
    } else {
      router.push("/dashboard/agent");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center bg-white p-6 mt-15 md:mt-20">
      <div className="w-full max-w-[400px] space-y-4">
        
        {/* Back Navigation */}
        <button 
          onClick={() => router.push("/login")}
          className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all text-xs font-semibold uppercase tracking-widest"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Back
        </button>

        {/* Header Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
             <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${role === 'agent' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
               {role} Access Portal
             </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h2>
          <p className="text-sm text-slate-500">
            {isSignUp ? "Enter your details to get started with Instrict." : "Enter your credentials to access your dashboard."}
          </p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <Input 
                type="email" 
                className="h-11 pl-10 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-1 focus:ring-slate-900 transition-all" 
                placeholder="name@example.com" 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <Input 
                type="password" 
                className="h-11 pl-10 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-1 focus:ring-slate-900 transition-all" 
                placeholder="••••••••" 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
          </div>

          <Button 
            className={`w-full h-11 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-[0.98] mt-2 ${
              role === 'agent' 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`} 
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : (isSignUp ? "Create Account" : "Sign In")}
          </Button>
        </form>

        {/* Footer Toggle */}
        <div className="text-center pt-2">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs font-medium text-slate-400 hover:text-slate-900 transition-colors py-2"
          >
            {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Create one"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-white"><Loader2 className="animate-spin text-slate-200" size={32} /></div>}>
      <AuthContent />
    </Suspense>
  );
}