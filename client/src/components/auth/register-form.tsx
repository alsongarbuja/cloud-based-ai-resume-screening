"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Chrome } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  completeCompanyOnboarding,
  completeJobSeekerOnboarding,
} from "@/lib/database/onboarding-actions";
import CompanyOnboardingForm, { CompanyFormData } from "./company-onboarding-form";
import JobSeekerOnboardingForm, { JobSeekerFormData } from "./job-seeker-onboarding-form";
import { ROUTES, getDynamicRoute } from "@/config/routes";
// import { handleOAuthSignIn, type OAuthProvider } from "@/lib/auth/oauth-handlers";

interface RegisterFormProps {
  searchParams?: {
    redirect?: string;
    new?: string;
    error?: string;
    email?: string;
  };
}

const RegisterForm = ({ searchParams }: RegisterFormProps) => {
  // const { data: session, status } = useSession();
  const [userType, setUserType] = useState<"user" | "org" | null>(null);
  const [onboardingStep, setOnboardingStep] = useState<"select-type" | "complete-profile">(
    "select-type"
  );
  const [isLoading, setIsLoading] = useState(false);
  // const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null);
  const [isCompletingOnboarding, setIsCompletingOnboarding] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const redirectTo = searchParams?.redirect || ROUTES.HOME;
  const isNewUser = searchParams?.new === "true";
  const error = searchParams?.error;
  const email = searchParams?.email;

  useEffect(() => {
    // user is already authenticated and has completed onboarding then redirect them
    // if (session?.user?.onboardingComplete) {
    //   router.push(redirectTo);
    //   return;
    // }
    // If user is authenticated but hasn't completed onboarding check for stored user type
    // if (session?.user && !session.user.onboardingComplete && isNewUser) {
    //   const storedUserType = sessionStorage.getItem("newUserType");
    //   if (storedUserType) {
    //     // Clear the stored type
    //     sessionStorage.removeItem("newUserType");
    //     // Set the user type and move to profile completion step
    //     if (storedUserType === "COMPANY") {
    //       setUserType("recruiter");
    //     } else {
    //       setUserType("job-seeker");
    //     }
    //     setOnboardingStep("complete-profile");
    //   }
    // }
  }, [redirectTo, router, isNewUser]);

  const handleManualOnboardingComplete = async () => {
    if (!userType) {
      toast({
        title: "Select Account Type",
        description: "Please select whether you're a job seeker or recruiter first",
        variant: "destructive",
      });
      return;
    }

    setOnboardingStep("complete-profile");
  };

  const handleGoogleSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google?userType=${userType}&redirectTo=/onboarding`;
    // await handleOAuthSignIn(
    //   {
    //     provider: "google",
    //     userType,
    //     redirectTo,
    //     isRegistering: true,
    //   },
    //   {
    //     setIsLoading,
    //     setLoadingProvider,
    //     toast,
    //   }
    // );
  };

  // const handleGitHubSignIn = async () => {
  //   await handleOAuthSignIn(
  //     {
  //       provider: "github",
  //       userType,
  //       redirectTo,
  //       isRegistering: true,
  //     },
  //     {
  //       setIsLoading,
  //       setLoadingProvider,
  //       toast,
  //     }
  //   );
  // };

  // if (session?.user?.onboardingComplete) {
  //   return null;
  // }

  // Show loading state while session is being fetched
  // if (status === "loading") {
  //   return (
  //     <div className="space-y-6 w-full">
  //       <div className="space-y-2 text-center">
  //         <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto animate-pulse" />
  //         <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto animate-pulse" />
  //       </div>
  //     </div>
  //   );
  // }

  // if (session?.user && !session.user.onboardingComplete) {
  //   if (onboardingStep === "complete-profile" && userType) {
  //     if (userType === "recruiter") {
  //       return (
  //         <CompanyOnboardingForm
  //           onComplete={handleCompanyOnboardingComplete}
  //           isLoading={isCompletingOnboarding}
  //         />
  //       );
  //     } else {
  //       return (
  //         <JobSeekerOnboardingForm
  //           onComplete={handleJobSeekerOnboardingComplete}
  //           isLoading={isCompletingOnboarding}
  //         />
  //       );
  //     }
  //   }

  return (
    <div className="space-y-6 w-full">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">
          {isNewUser ? "Complete Your Profile" : "Create Your Account"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isNewUser
            ? "Choose your account type to get started"
            : "Join our platform and start your journey"}
        </p>
      </div>

      {error === "AlreadyRegistered" && (
        <div className="bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/50 text-blue-600 dark:text-blue-400 px-5 py-4 rounded-xl backdrop-blur-sm">
          <p className="font-semibold text-base mb-1.5">Account Already Exists</p>
          <p className="text-sm opacity-90 mb-3">
            {email ? `An account for ${email} already exists. ` : "You already have an account. "}
            Please sign in instead of creating a new account.
          </p>
          <Link
            href={
              redirectTo !== ROUTES.HOME
                ? getDynamicRoute.loginWithRedirect(redirectTo)
                : ROUTES.LOGIN
            }
            className="text-sm font-semibold underline hover:no-underline inline-flex items-center gap-1 hover:gap-2 transition-all"
          >
            Sign in instead <span>→</span>
          </Link>
        </div>
      )}

      <div className="space-y-4">
        <Label className="text-sm font-semibold">I am a:</Label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setUserType("user")}
            disabled={isLoading}
            className={`group flex flex-col items-center justify-center gap-2.5 p-5 rounded-xl border-2 transition-all duration-200 ${
              userType === "user"
                ? "border-primary bg-primary/10 shadow-lg shadow-primary/5 scale-[1.02]"
                : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
              👤
            </span>
            <span className={`font-semibold text-sm ${userType === "user" ? "text-primary" : ""}`}>
              Job Seeker
            </span>
            <span className="text-xs text-muted-foreground">Find opportunities</span>
          </button>
          <button
            onClick={() => setUserType("org")}
            disabled={isLoading}
            className={`group flex flex-col items-center justify-center gap-2.5 p-5 rounded-xl border-2 transition-all duration-200 ${
              userType === "org"
                ? "border-primary bg-primary/10 shadow-lg shadow-primary/5 scale-[1.02]"
                : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
              🏢
            </span>
            <span className={`font-semibold text-sm ${userType === "org" ? "text-primary" : ""}`}>
              Recruiter
            </span>
            <span className="text-xs text-muted-foreground">Find talent</span>
          </button>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <Button
          onClick={handleGoogleSignIn}
          disabled={isLoading || !userType}
          variant="outline"
          className="w-full border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 py-6 rounded-xl font-medium transition-all duration-200"
          size="lg"
        >
          <Chrome className="w-5 h-5 mr-2.5" />
          Continue with Google
          {/* {loadingProvider === "google" ? "Signing in..." : "Continue with Google"} */}
        </Button>

        {/* <Button
          onClick={handleGitHubSignIn}
          disabled={isLoading || !userType}
          variant="outline"
          className="w-full border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 py-6 rounded-xl font-medium transition-all duration-200"
          size="lg"
        >
          <Github className="w-5 h-5 mr-2.5" />
          {loadingProvider === "github" ? "Signing in..." : "Continue with GitHub"}
        </Button> */}
      </div>

      <div className="text-center text-sm pt-2">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link
          href={
            redirectTo !== ROUTES.HOME
              ? getDynamicRoute.loginWithRedirect(redirectTo)
              : ROUTES.LOGIN
          }
          className="text-primary hover:underline font-semibold inline-flex items-center gap-1 hover:gap-1.5 transition-all"
        >
          Sign in here <span>→</span>
        </Link>
      </div>

      <div className="text-xs text-muted-foreground/80 text-balance text-center leading-relaxed pt-2">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </div>
    </div>
  );
};

export default RegisterForm;
