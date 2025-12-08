import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const frontendCookieName = process.env.AUTH_COOKIE_NAME || "kaam-ai-auth-token";
  const clientUrl = new URL(process.env.NEXT_PUBLIC_CLIENT_URL || "/", request.url);

  console.log(frontendCookieName);

  (await cookies()).delete(frontendCookieName);

  return NextResponse.redirect(clientUrl);
}
