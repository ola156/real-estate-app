"use client";
import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  PlusSquare,
  Users,
  UserCog,
  LogOut,
  Home,
  Loader2,
  Menu,
  X,
} from "lucide-react";
import { supabase } from "@/utils/client";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import DashboardListings from "./_components/Dashboard";
import OnboardingForm from "./_components/OnboardingForm";
import AddNewListing from "./_components/AddNewListing";
import AgentProfile from "./_components/AgentProfile";

export default function AgentDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [profiles, setProfiles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function checkProfile() {
      try {
        setLoading(true);
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (!authUser || authError) {
          setLoading(false);
          return;
        }

        setUser(authUser);

        const { data, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .maybeSingle();

        if (data) {
          setProfiles(data);
        }
      } catch (err) {
        console.error("Setup error:", err);
      } finally {
        setLoading(false);
      }
    }

    checkProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDFDFD]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
          Authenticating...
        </p>
      </div>
    );
  }

 if (user && (!profiles || !profiles.agency_name)) {
    return (
      <OnboardingForm 
        user={user} 
        onComplete={() => window.location.reload()} 
      />
    );
  }

  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Add New Listing", icon: <PlusSquare size={20} /> },
    { name: "Manage Profile", icon: <UserCog size={20} /> },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen  bg-[#FDFDFD]">
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex p-4 w-64 bg-slate-100 border-r border-slate-200 fixed h-full flex-col p-5 transition-all">
        <div className=" ml-3">
          <Link href={"/"}>
            <Image
              src={"/logo.svg"}
              width={100}
              height={120}
              alt="logo"
              className="w-[100px]"
            />
          </Link>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-sm font-bold ${
                activeTab === item.name
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-500 hover:text-blue-600 hover:bg-white"
              }`}>
              {item.icon} {item.name}
            </button>
          ))}
        </nav>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-red-500 text-sm font-bold transition-colors w-full">
              <LogOut size={20} /> Logout
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-[2rem] p-6">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-black">
                Logging out?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-500 font-medium text-lg">
                Are you sure you want to log out? You will need to sign back in
                to manage your listings.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6 gap-3">
              <AlertDialogCancel className="rounded-2xl h-14 font-bold bg-slate-100 border-none px-6">
                Stay logged in
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                className="rounded-2xl h-14 font-bold bg-red-500 hover:bg-red-600 px-8">
                Yes, Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </aside>

      {/* --- MOBILE BOTTOM NAVIGATION --- */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 flex justify-around items-center z-50">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`flex flex-col items-center p-2 rounded-lg transition-all ${
              activeTab === item.name ? "text-blue-600" : "text-slate-400"
            }`}>
            {item.icon}
            <span className="text-[10px] mt-1 font-bold">
              {item.name.split(" ")[0]}
            </span>
          </button>
        ))}
      
          <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="text-slate-400 p-2">
              <LogOut size={20} /> 
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-[2rem] p-6">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-black">
                Logging out?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-500 font-medium text-lg">
                Are you sure you want to log out? You will need to sign back in
                to manage your listings.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6 gap-3">
              <AlertDialogCancel className="rounded-2xl h-14 font-bold bg-slate-100 border-none px-6">
                Stay logged in
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                className="rounded-2xl h-14 font-bold bg-red-500 hover:bg-red-600 px-8">
                Yes, Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 lg:ml-64 pb-24 lg:pb-0">
        {/* TOP BAR */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-10">
          <div className="flex items-center gap-7">
            {/* Logo shows only on mobile top bar */}
             <Link href={"/"}>
            <Image
              src={"/logo.svg"}
              width={100}
              height={120}
              alt="logo"
              className="w-[100px]"
            />
          </Link>
            <h2 className=" hidden lg:flex font-black text-slate-800 text-sm lg:text-lg uppercase tracking-widest">
              {activeTab}
            </h2>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
              Welcome,
            </p>
            <p className="text-xs lg:text-sm font-black text-blue-600 truncate max-w-[120px]">
              {profiles?.agency_name || "Agent"}
            </p>
          </div>
        </header>

        {/* PAGE WORKSPACE */}
        <div className="p-4 lg:p-10 max-w-6xl mx-auto">
          {activeTab === "Dashboard" && (
            <DashboardListings userId={profiles?.id} />
          )}

          {activeTab === "Add New Listing" && (
            <div className="w-full bg-white p-4 rounded-[2rem] border border-slate-100">
              <AddNewListing />
            </div>
          )}
          {activeTab === "Manage Profile" && (
            <div className="w-full bg-white  rounded-[2rem] border border-slate-100">
              <AgentProfile />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
