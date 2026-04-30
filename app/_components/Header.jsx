"use client";
import { Button } from "@/components/ui/button";
import { House, Plus, User, List, LogOut, ChevronDown, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { Show, SignOutButton, SignUpButton } from "@clerk/nextjs";
import InspectionButton from "./InspectionButton";
import { useUser } from "@clerk/nextjs";
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
  SheetDescription,
} from "@/components/ui/sheet";

function Header() {
  const path = usePathname();
  const { user } = useUser();

  const NavLinks = ({ isMobile = false }) => (
    <>
      {[
        { name: "Home", href: "/" },
        { name: "For Rent", href: "/for-rent" },
        { name: "For Sale", href: "/for-sale" },
        { name: "Find A Roommate", href: "/roommates" },
         { name: "Shortlets", href: "/shortlet" },
      ].map((link) => (
        <Link key={link.href} href={link.href}>
          <li
            className={`${
              path === link.href ? "text-primary font-bold" : "hover:text-primary text-slate-600"
            } font-medium text-xs cursor-pointer list-none transition-all ${
              isMobile ? "text-lg py-4 border-b border-slate-100" : ""
            }`}
          >
            {link.name}
          </li>
        </Link>
      ))}
    </>
  );

  return (
    <div className="p-4 md:p-6 px-4 md:px-10 flex justify-between items-center shadow-sm fixed top-0 w-full z-40 bg-white">
      <div className="flex gap-4 md:gap-8 items-center">
        
        {/* HAMBURGER: Visible below 1200px */}
        <div className="min-[1201px]:hidden  z-50">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                <Menu className="h-6 w-6 text-slate-700" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-6">
              {/* Accessibility: Screen Reader Only Header */}
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>
                  Explore property listings, rentals, and roommates on Instrict.
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-10 mt-6">
                <Image 
                  src={"/logo.svg"} 
                  width={100} 
                  height={40} 
                  alt="Instrict Logo" 
                  className="w-[100px]" 
                />
                <ul className="flex flex-col">
                  <NavLinks isMobile={true} />
                </ul>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* LOGO */}
        <div className="flex-shrink-0">
          <Link href={"/"}>
            <Image 
              src={"/logo.svg"} 
              width={100} 
              height={120} 
              alt="logo" 
              className="w-[80px] md:w-[100px]" 
            />
          </Link>
        </div>

        {/* DESKTOP NAV: Hidden below 1200px */}
        <ul className="hidden min-[1201px]:flex gap-8 items-center">
          <NavLinks />
        </ul>
      </div>

      <div className="flex gap-2 items-center">
        <Show when="signed-out">
          <SignUpButton>
            <Button variant="outline" className="hidden">Login</Button>
          </SignUpButton>
          <InspectionButton />
        </Show>

        <Show when="signed-in">
          <div className="flex gap-2">
            <Link href={"/add-new-listing"}>
              <Button className="flex gap-2 h-9 md:h-10 px-3 md:px-4">
                <House className="h-4 w-4 md:h-5 md:w-5" /> 
                <span className="hidden sm:block">Post New Ad</span>
              </Button>
            </Link>

            <Link href={"/add-roommate"}>
              <Button className="flex gap-2 h-9 md:h-10 px-3 md:px-4" variant="outline">
                <Plus className="h-4 w-4 md:h-5 md:w-5" />
                <span className="hidden sm:block">Add Roommates</span>
              </Button>
            </Link>
          </div>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 focus:outline-none ml-1 md:ml-2">
                <Image
                  src={user?.imageUrl}
                  width={35}
                  height={35}
                  alt="user profile"
                  className="rounded-full border border-slate-200 w-[30px] h-[30px] md:w-[35px] md:h-[35px]"
                />
                <ChevronDown size={14} className="text-slate-400 hidden md:block" />
              </button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-52 mt-2 p-2 rounded-xl shadow-lg border-slate-100">
              <DropdownMenuLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 py-2">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link href="/user">
                  <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-lg cursor-pointer">
                    <User size={16} /> Profile
                  </DropdownMenuItem>
                </Link>
                <Link href="/user/my-listing">
                  <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-lg cursor-pointer">
                    <List size={16} /> My Listing
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <SignOutButton>
                  <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-lg cursor-pointer text-red-500 focus:text-red-500">
                    <LogOut size={16} /> Logout
                  </DropdownMenuItem>
                </SignOutButton>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </Show>
      </div>
    </div>
  );
}

export default Header;