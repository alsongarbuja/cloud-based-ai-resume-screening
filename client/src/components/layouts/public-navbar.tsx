import Link from "next/link";
import React from "react";
import { buttonVariants } from "../ui/button";
import { ThemeToggle } from "../theme/ThemeToggle";
import { Logo } from "../ui/logo";
import { auth } from "@/lib/auth/config";
import UserDropdownWrapper from "./user-dropdown-wrapper";
import { ROUTES } from "@/config/routes";

const PublicNavbar = async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (await auth()) as any;

  return (
    <nav className="flex items-center justify-between py-6 border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Logo size="md" showText={true} href={ROUTES.HOME} className="hidden sm:flex" />
        <Logo size="md" showText={false} href={ROUTES.HOME} className="sm:hidden" />
        <Link
          href={ROUTES.PRICING}
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
            className: "font-medium hover:bg-accent transition-all",
          })}
        >
          Pricing
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {session?.user && session.user.userType === "COMPANY" && (
          <Link
            className={buttonVariants({
              size: "lg",
              className: "font-semibold shadow-md hover:shadow-lg transition-all",
            })}
            href={ROUTES.POST_JOB}
          >
            Post Job
          </Link>
        )}

        {session?.user ? (
          <UserDropdownWrapper
            email={session.user.email!}
            name={session.user.name!}
            image={session.user.image!}
          />
        ) : (
          <Link
            href={ROUTES.LOGIN}
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "font-semibold border-border/50 hover:border-primary/50 hover:bg-accent transition-all shadow-none",
            })}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default PublicNavbar;