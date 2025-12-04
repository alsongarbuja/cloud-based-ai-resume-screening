import { User } from "@/types";
import { cookies } from "next/headers";
import CompanyOnboardingForm from "@/components/auth/company-onboarding-form";
import JobSeekerOnboardingForm from "@/components/auth/job-seeker-onboarding-form";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const page = async () => {
  const cookieStore = cookies();
  const authToken = (await cookieStore).get(process.env.AUTH_COOKIE_TOKEN_NAME || "auth-token");
  let userData: User | null = null;

  if (authToken) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile`, {
        headers: {
          Cookie: `${process.env.AUTH_COOKIE_TOKEN_NAME || ""}=${authToken?.value}`,
        },
      });
      const data = await res.json();
      userData = data;
    } catch (error) {
      console.error(error);
    }

    if (!userData) {
      return null; // TODO: redirect instead of returning null
    }

    if (userData.type === "org") {
      return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4">
          <div className="absolute top-6 right-6">
            <ThemeToggle />
          </div>
          <div className="flex w-full max-w-md flex-col gap-8">
            <CompanyOnboardingForm token={authToken.value} />
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
        <div className="flex w-full max-w-md flex-col gap-8">
          <JobSeekerOnboardingForm token={authToken.value} userId={userData.id} />
        </div>
      </div>
    );
  }

  return null;
};

export default page;
