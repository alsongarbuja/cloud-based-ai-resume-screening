import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";

// API route to trigger a session refresh
export async function POST() {
  try {
    // Get current session
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Return a response that triggers the client to refresh
    return NextResponse.json({ 
      success: true, 
      message: "Session refresh triggered",
      timestamp: Date.now()
    });
    
  } catch (error) {
    console.error("Session refresh error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}