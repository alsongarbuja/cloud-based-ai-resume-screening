"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";
import { Heart, Layers2, LogOut, FileText, Users } from "lucide-react";
import { signOut } from "next-auth/react";
import { ROUTES, getDynamicRoute } from "@/config/routes";

interface UserInfoProps {
  email: string;
  name: string;
  image: string;
  userType: string;
}

const UserDropdown = ({ email, name, image, userType }: UserInfoProps) => {
  
  const handleSignOut = async () => {
    try {
      await signOut({
        redirect: true,
        callbackUrl: ROUTES.HOME
      });
    } catch (error) {
      console.error("Sign out error:", error);
      window.location.href = ROUTES.HOME;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer size-[42px] m-0">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{name?.charAt(0) || email?.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 mt-1" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-foreground">
            {name || "User"}
          </span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            {email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {userType === "JOB_SEEKER" && (
            <>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={ROUTES.FAVORITES}>
                  <Heart
                    size={16}
                    strokeWidth={2}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                  <span>Saved Jobs</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={ROUTES.MY_APPLICATIONS}>
                  <FileText
                    size={16}
                    strokeWidth={2}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                  <span>My Applications</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}

          {userType === "COMPANY" && (
            <>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={ROUTES.MY_JOBS}>
                  <Layers2
                    size={16}
                    strokeWidth={2}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                  <span>My Job Listings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={ROUTES.MY_JOB_APPLICATIONS}>
                  <Users
                    size={16}
                    strokeWidth={2}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                  <span>Applications Received</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={ROUTES.POST_JOB}>
                  <FileText
                    size={16}
                    strokeWidth={2}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                  <span>Post New Job</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={handleSignOut}
        >
          <LogOut
            size={16}
            strokeWidth={2}
            className="opacity-60"
            aria-hidden="true"
          />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;