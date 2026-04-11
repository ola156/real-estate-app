"use client";
import { Button } from "@/components/ui/button";
import { House, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { Show, SignOutButton, SignUpButton, UserButton } from "@clerk/nextjs";
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
  }, []);
  return (
    <div className="p-6 px-5 md:px-10 flex justify-between shadow-sm fixed top-0 w-full z-1000 bg-white">
      <div className="flex gap-12 items-center">
        <div>
          <Image src={"/logo.svg"} width={100} height={120} alt="logo" />
        </div>
        <ul className="hidden md:flex gap-10 ">
          <Link href={"/"}>
            <li
              className={`
        ${path === "/" ? "text-primary" : "hover:text-primary"} font-medium text-sm cursor-pointer
        `}>
              Home
            </li>
          </Link>
          <Link href={"/for-rent"}>
            <li
              className={`
        ${path === "/for-rent" ? "text-primary" : "hover:text-primary"} font-medium text-sm cursor-pointer
        `}>
              For Rent
            </li>
          </Link>
          <Link href={"/roommates"}>
            <li
              className={`${path === "/roommates" ? "text-primary" : "hover:text-primary"} font-medium text-sm cursor-pointer transition-colors`}>
              Find A Roommate
            </li>
          </Link>
        </ul>
      </div>
      <div className="flex gap-2">
        <Show when="signed-out">
          <SignUpButton>
            <Button variant="outline" className="hidden">
              Login
            </Button>
          </SignUpButton>
          <InspectionButton />
        </Show>

        <Show when="signed-in">
          <Link href={"/add-new-listing"} className="hidden md:block">
            <Button className="flex gap-2">
              <House className="h-5 w-5" /> Post New Ad
            </Button>
          </Link>
          <Link href={"/add-new-listing"} className="md:hidden block">
            <Button className="flex gap-2">
              <House className="h-5 w-5" />
            </Button>
          </Link>
          <Link href={"/add-roommate"} className="hidden md:block">
            <Button className="flex gap-2"> Add Roommates</Button>
          </Link>
          <Link href={"/add-roommate"} className="md:hidden block">
            <Button className="flex gap-2">
              <Plus className="h-5 w-5" />{" "}
            </Button>
          </Link>
         
          <DropdownMenu className="z-100 absolute left-3 " >
            <DropdownMenuTrigger asChild>
               <Image
            src={user?.imageUrl}
            width={35}
            height={35}
            alt="user profile"
            className="rounded-full"
          />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem>
                 <Link href="/user">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>My Listing</DropdownMenuItem>
                <DropdownMenuItem><SignOutButton>Logout</SignOutButton></DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </Show>
      </div>
    </div>
  );
}

export default Header;
