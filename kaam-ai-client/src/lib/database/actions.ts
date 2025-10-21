"use server";

import { signOut } from "@/lib/auth/config";
import { redirect } from "next/navigation";

export async function handleSignOut() {
  try {
    await signOut({ 
      redirectTo: "/",
    });
  } catch (error) {
    console.error("Sign out error:", error);
    redirect("/");
  }
}