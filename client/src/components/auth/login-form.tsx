"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Google from "@/assets/svg/Google";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ROUTES, getDynamicRoute } from "@/config/routes";

const LoginForm = () => {
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirect") || ROUTES.HOME;
  const error = searchParams.get("error");

  return (
    <div className="flex flex-col gap-6">
      {error === "AuthenticationFailed" && (
        <div className="bg-destructive/10 dark:bg-destructive/20 border border-destructive/50 text-destructive px-5 py-4 rounded-xl backdrop-blur-sm">
          <p className="font-semibold text-base mb-1.5">Authentication Failed</p>
          <p className="text-sm opacity-90">There was an error signing you in. Please try again.</p>
        </div>
      )}

      {error === "AccessDenied" && (
        <div className="bg-yellow-500/10 dark:bg-yellow-500/20 border border-yellow-500/50 text-yellow-700 dark:text-yellow-500 px-5 py-4 rounded-xl backdrop-blur-sm">
          <p className="font-semibold text-base mb-1.5">Complete Profile Required</p>
          <p className="text-sm opacity-90 mb-3">
            Please complete your profile setup before accessing the platform.
          </p>
          <Link
            href={getDynamicRoute.registerWithRedirect(
              redirectTo !== ROUTES.HOME ? redirectTo : undefined,
              true
            )}
            className="text-sm font-semibold underline hover:no-underline inline-flex items-center gap-1 hover:gap-2 transition-all"
          >
            Complete profile <span>→</span>
          </Link>
        </div>
      )}

      <Card className="text-center shadow-none border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
          <CardDescription className="text-base">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google?redirectTo=${encodeURIComponent(redirectTo)}`;
              }}
              className="group w-full flex items-center justify-center gap-3 px-5 py-3.5 border-2 border-border/50 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 font-medium"
            >
              <Google className="size-5 group-hover:scale-110 transition-transform duration-200" />
              <span>Continue with Google</span>
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm pt-2">
        <span className="text-muted-foreground">Don't have an account? </span>
        <Link
          href={
            redirectTo !== ROUTES.HOME
              ? getDynamicRoute.registerWithRedirect(redirectTo)
              : ROUTES.REGISTER
          }
          className="text-primary hover:underline font-semibold inline-flex items-center gap-1 hover:gap-1.5 transition-all"
        >
          Create one here <span>→</span>
        </Link>
      </div>

      <div className="text-xs text-muted-foreground/80 text-balance text-center leading-relaxed pt-2">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </div>
    </div>
  );
};

export default LoginForm;
