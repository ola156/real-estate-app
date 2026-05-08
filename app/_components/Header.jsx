"use client";
import { Button } from "@/components/ui/button";
import {
  House,
  User,
  List,
  LogOut,
  ChevronDown,
  Menu,
  ShieldCheck,
  Briefcase,
  LayoutDashboard,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import InspectionButton from "./InspectionButton";

function Header() {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  // Define paths where header should be hidden
  const hideHeaderPaths = [ '/login', "/login/auth", '/dashboard/agent', '/dashboard/admin','/auth'];

  useEffect(() => {
    const updateUserData = (session) => {
      if (session?.user) {
        setUser(session.user);
        const userRole = session.user.user_metadata?.user_role || "user";
        setRole(userRole);
      } else {
        setUser(null);
        setRole(null);
      }
    };

    const getUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      updateUserData(session);
    };
    getUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      updateUserData(session);
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        router.refresh();
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, [router]);

  // Hide header on login/signup pages
  if (hideHeaderPaths.includes(path)) {
    return null;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    router.push("/");
  };

  const NavLinks = ({ isMobile = false, closeMenu }) => (
    <>
      {[
        { name: "Home", href: "/" },
        { name: "For Rent", href: "/for-rent" },
        { name: "For Sale", href: "/for-sale" },
        { name: "Find A Roommate", href: "/roommates" },
        { name: "Shortlets", href: "/shortlet" },
      ].map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={() => isMobile && closeMenu && closeMenu()}
        >
          <li
            className={`${
              path === link.href ? "text-primary font-bold" : "hover:text-primary text-slate-600"
            } font-medium text-xs cursor-pointer list-none transition-all duration-300 ${
              isMobile ? "text-lg py-6 border-b border-slate-100" : ""
            }`}
          >
            {link.name}
          </li>
        </Link>
      ))}
    </>
  );

  return (
    <div className=" p-4 md:p-6 px-4 md:px-10 flex justify-between items-center shadow-sm fixed top-0 w-full z-40 bg-white">
      <div className="flex gap-4 md:gap-8 items-center">
        {/* MOBILE MENU */}
        <div className="min-[1201px]:hidden z-50">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                <Menu className="h-6 w-6 text-slate-700" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0 flex flex-col">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col p-8 mt-4">
                <Image src={"/logo.svg"} width={100} height={40} alt="Logo" className="mb-10" />
                <ul className="flex flex-col">
                  <NavLinks isMobile={true} closeMenu={() => setOpen(false)} />
                </ul>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* LOGO */}
        <div className="flex-shrink-0">
          <Link href={"/"}>
            <Image src={"/logo.svg"} width={100} height={120} alt="logo" className="w-[80px] md:w-[100px]" />
          </Link>
        </div>

        {/* DESKTOP NAV */}
        <ul className="hidden min-[1201px]:flex gap-8 items-center">
          <NavLinks />
        </ul>
      </div>

      <div className="flex gap-2 items-center">
        {!user ? (
          <Link href="/login">
            <Button variant="outline" className="text-xs font-bold">Sign In</Button>
          </Link>
        ) : (
          <div className="flex items-center gap-4">
           

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 focus:outline-none">
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden shadow-sm">
                    {user?.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} width={36} height={36} alt="profile" className="object-cover" />
                    ) : (
                      <User size={20} className="text-slate-400" />
                    )}
                  </div>
                  <ChevronDown size={14} className="text-slate-400 hidden md:block" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 mt-2 p-2 rounded-xl shadow-lg border-slate-100">
                <DropdownMenuLabel className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-3 py-2">
                  My Account ({role})
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuGroup>
                  {/* DASHBOARD (Conditional for Agents/Admins) */}
                  {(role === 'agent' || role === 'admin') && (
                    <Link href={role === 'admin' ? "/dashboard/admin" : "/dashboard/agent"}>
                      <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-lg cursor-pointer font-medium">
                        <LayoutDashboard size={16} className="text-primary" /> Dashboard
                      </DropdownMenuItem>
                    </Link>
                  )}

                  

                   {/* Show Post Ad only for regular users, otherwise only show profile dropdown */}
            {role !== 'admin' && role !== 'agent' && (
             <InspectionButton />
            )}
                  

                  <DropdownMenuSeparator />
                  
                  {/* LOGOUT */}
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
                  >
                    <LogOut size={16} /> Logout
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;