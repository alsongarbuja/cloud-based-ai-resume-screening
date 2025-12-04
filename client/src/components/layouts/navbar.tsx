import Link from "next/link";
import React from "react";
import { buttonVariants } from "../ui/button";
import { ThemeToggle } from "../theme/ThemeToggle";
import { Logo } from "../ui/logo";
import UserDropdownWrapper from "./user-dropdown-wrapper";
import { ROUTES } from "@/config/routes";
import { cookies } from "next/headers";
import { getUserProfile } from "@/lib/database/firestore-server";
import { UserType } from "@/types";

const Navbar = async () => {
  const cookieStore = cookies();
  const authToken = (await cookieStore).get(process.env.AUTH_COOKIE_TOKEN_NAME || "");

  const user = await getUserProfile(authToken?.value || "");

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
        {user ? (
          <UserDropdownWrapper
            email={user.email!}
            name={user.username!}
            image={user.profilePic!}
            type={user.type! as UserType}
          />
        ) : (
          <Link
            href={ROUTES.LOGIN}
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className:
                "font-semibold border-border/50 hover:border-primary/50 hover:bg-accent transition-all shadow-none",
            })}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
