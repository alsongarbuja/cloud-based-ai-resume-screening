
import { signIn } from "next-auth/react";
import { ROUTES } from "@/config/routes";

export type OAuthProvider = "google" | "github";

export type UserAccountType = "COMPANY" | "JOB_SEEKER";

export interface OAuthSignInParams {
  provider: OAuthProvider;
  userType?: "recruiter" | "job-seeker" | null;
  redirectTo?: string;
  isRegistering?: boolean;
}

export interface OAuthCallbacks {
  setIsLoading: (loading: boolean) => void;
  setLoadingProvider: (provider: OAuthProvider | null) => void;
  toast: (options: {
    title: string;
    description: string;
    variant?: "default" | "destructive";
  }) => void;
}

export const handleOAuthSignIn = async (
  params: OAuthSignInParams,
  callbacks: OAuthCallbacks
): Promise<void> => {
  const { provider, userType, redirectTo = ROUTES.HOME, isRegistering = false } = params;
  const { setIsLoading, setLoadingProvider, toast } = callbacks;

  if (isRegistering && !userType) {
    toast({
      title: "Select Account Type",
      description: "Please select whether you're a job seeker or recruiter first",
      variant: "destructive",
    });
    return;
  }

  setIsLoading(true);
  setLoadingProvider(provider);

  try {
    if (isRegistering && userType && typeof window !== "undefined") {
      const accountType: UserAccountType =
        userType === "recruiter" ? "COMPANY" : "JOB_SEEKER";
      sessionStorage.setItem("newUserType", accountType);
    }

    const callbackUrl = isRegistering
      ? `${ROUTES.AUTH_CALLBACK}?isRegistering=true&redirect=${encodeURIComponent(redirectTo)}`
      : redirectTo;

    await signIn(provider, {
      redirect: true,
      callbackUrl,
    });
  } catch (error) {
    console.error(`${provider.charAt(0).toUpperCase() + provider.slice(1)} sign in error:`, error);

    toast({
      title: "Authentication Error",
      description: `Failed to sign in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}. Please try again.`,
      variant: "destructive",
    });

    setIsLoading(false);
    setLoadingProvider(null);
  }
};


export const getUserTypeFromStorage = (): UserAccountType | null => {
  if (typeof window === "undefined") return null;

  const storedType = sessionStorage.getItem("newUserType");
  if (storedType === "COMPANY" || storedType === "JOB_SEEKER") {
    return storedType;
  }

  return null;
};


export const clearUserTypeFromStorage = (): void => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("newUserType");
  }
};
