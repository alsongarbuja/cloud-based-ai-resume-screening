import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";

interface CallbackPageProps {
  searchParams: Promise<{ 
    redirect?: string; 
    isRegistering?: string;
    error?: string;
    email?: string;
  }>;
}

const CallbackPage = async ({ searchParams }: CallbackPageProps) => {
  const session = await auth();
  const params = await searchParams;
  const intendedDestination = params.redirect || "/";
  const isRegistering = params.isRegistering === "true";
  const error = params.error;
  const email = params.email;

  if (error) {
    if (error === "NotRegistered") {
      return redirect(`/register?error=NotRegistered&email=${encodeURIComponent(email || '')}&redirect=${encodeURIComponent(intendedDestination)}`);
    }
    if (error === "AlreadyRegistered") {
      return redirect(`/login?error=AlreadyRegistered&email=${encodeURIComponent(email || '')}&redirect=${encodeURIComponent(intendedDestination)}`);
    }
  }

  if (!session?.user) {
    // Not authenticated redirect to login with error
    return redirect(`/login?error=AuthenticationFailed&redirect=${encodeURIComponent(intendedDestination)}`);
  }

  // Check if this is a new user (just created in last 30 seconds)
  const isNewUser = session.user.isNewUser === true;

  // Case 1: New user trying to LOGIN (not register) -> redirect directly to register
  if (isNewUser && !isRegistering) {
    return redirect(`/register?redirect=${encodeURIComponent(intendedDestination)}`);
  }

  // Case 2: Existing user with completed onboarding trying to REGISTER
  if (!isNewUser && isRegistering && session.user.onboardingComplete) {
    return redirect(`/register?error=AlreadyRegistered&email=${encodeURIComponent(session.user.email || '')}&redirect=${encodeURIComponent(intendedDestination)}`);
  }

  // Case 3: User completed onboarding -> send to destination
  if (session.user.onboardingComplete) {
    return redirect(intendedDestination);
  }

  // Case 4: New user or user without completed onboarding -> complete registration
  return redirect(`/register?new=true&redirect=${encodeURIComponent(intendedDestination)}`);
};

export default CallbackPage;