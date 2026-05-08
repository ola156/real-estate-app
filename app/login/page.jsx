"use client";
import { useRouter } from "next/navigation";
import { User, ShieldCheck, ChevronRight } from "lucide-react";

export default function LoginSelection() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center p-4 mt-20 md:mt-30">
      <div className="w-full max-w-[480px] space-y-8">
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Select your account type to sign in
          </p>
        </div>

        <div className="space-y-4">
          {/* USER ROW - Blue Hover Effect */}
          <button
            onClick={() => router.push("/login/auth?role=user")}
            className="group w-full flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl 
                       hover:border-blue-500/50 hover:bg-blue-50/30 hover:shadow-xl hover:shadow-blue-500/5 
                       transition-all duration-300 active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-50 text-slate-500 rounded-xl 
                              group-hover:bg-blue-500 group-hover:text-white group-hover:rotate-3 
                              transition-all duration-300 shadow-sm">
                <User size={22} />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  Regular User
                </h3>
                <p className="text-xs text-slate-500 font-medium">Find places and roommates</p>
              </div>
            </div>
            <div className="p-1 rounded-full group-hover:bg-blue-100 transition-colors">
              <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          </button>

          {/* AGENT ROW - Green Hover Effect */}
          <button
            onClick={() => router.push("/login/auth?role=agent")}
            className="group w-full flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl 
                       hover:border-emerald-500/50 hover:bg-emerald-50/30 hover:shadow-xl hover:shadow-emerald-500/5 
                       transition-all duration-300 active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-50 text-slate-500 rounded-xl 
                              group-hover:bg-emerald-500 group-hover:text-white group-hover:-rotate-3 
                              transition-all duration-300 shadow-sm">
                <ShieldCheck size={22} />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                  Property Agent
                </h3>
                <p className="text-xs text-slate-500 font-medium">Manage and list properties</p>
              </div>
            </div>
            <div className="p-1 rounded-full group-hover:bg-emerald-100 transition-colors">
              <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          </button>
        </div>

        <div className="text-center pt-4">
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-semibold">
            Instrict Secure Portal
          </p>
        </div>
      </div>
    </div>
  );
}