import { cookies } from "next/headers";
import "server-only";

export async function getAuthToken() {
  const cookieStore = cookies();
  const cookieName = process.env.AUTH_COOKIE_TOKEN_NAME || "auth-token";
  const authToken = (await cookieStore).get(cookieName);
  return authToken?.value || "";
}
