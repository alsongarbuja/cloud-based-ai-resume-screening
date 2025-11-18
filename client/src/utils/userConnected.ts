import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { ROUTES } from "@/config/routes";

export async function userConnected() {
  const session = await auth();

  if (!session?.user) {
    return redirect(ROUTES.LOGIN);
  }

  return session.user;
}