"use client";
import { Button } from "@/components/ui/button";
import { House, Plus, User, List, LogOut, ChevronDown } from "lucide-react";
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

function Header() {
  const path = usePathname();
  const { user } = useUser();

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <div className="p-6 px-5 md:px-10 flex justify-between shadow-sm fixed top-0 w-full z-[1000] bg-white">
      <div className="flex gap-12 items-center">
        <div>
          <Link href={"/"}>
            <Image src={"/logo.svg"} width={100} height={120} alt="logo" />
          </Link>
        </div>
        <ul className="hidden md:flex gap-10 ">
          <Link href={"/"}>
            <li className={`${path === "/" ? "text-primary" : "hover:text-primary"} font-medium text-sm cursor-pointer`}>
              Home
            </li>
          </Link>
          <Link href={"/for-rent"}>
            <li className={`${path === "/for-rent" ? "text-primary" : "hover:text-primary"} font-medium text-sm cursor-pointer`}>
              For Rent
            </li>
          </Link>
          <Link href={"/roommates"}>
            <li className={`${path === "/roommates" ? "text-primary" : "hover:text-primary"} font-medium text-sm cursor-pointer transition-colors`}>
              Find A Roommate
            </li>
          </Link>
        </ul>
      </div>

      <div className="flex gap-2 items-center">
        <Show when="signed-out">
          <SignUpButton>
            <Button variant="outline" className="hidden">
              Login
            </Button>
          </SignUpButton>
          <InspectionButton />
        </Show>

        <Show when="signed-in">
          {/* Post New Ad Logic */}
          <Link href={"/add-new-listing"} className="hidden md:block">
            <Button className="flex gap-2">
              <House className="h-5 w-5" /> Post New Ad
            </Button>
          </Link>
          <Link href={"/add-new-listing"} className="md:hidden block">
            <Button size="icon" className="flex gap-2">
              <House className="h-5 w-5" />
            </Button>
          </Link>

          {/* Add Roommates Logic (Fixed for mobile) */}
          <Link href={"/add-roommate"} className="hidden md:block">
            <Button className="flex gap-2"> Add Roommates</Button>
          </Link>
          <Link href={"/add-roommate"} className="md:hidden block">
            <Button size="icon" className="flex gap-2">
              <Plus className="h-5 w-5" />
            </Button>
          </Link>

          {/* Styled Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 focus:outline-none ml-2">
                <Image
                  src={user?.imageUrl}
                  width={35}
                  height={35}
                  alt="user profile"
                  className="rounded-full border border-slate-200"
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