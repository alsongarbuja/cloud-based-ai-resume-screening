import { userConnected } from "@/utils/userConnected";
import Navbar from "@/components/layouts/navbar";
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { ROUTES, getDynamicRoute } from "@/config/routes";

const JobPostingForm = dynamic(
  () => import("@/components/jobs/job-posting-form"),
  {
    loading: () => (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ),
  }
);

export default async function PostJobPage() {
  await userConnected();

  const session = await auth();
  
  if (!session?.user || session.user.userType !== "COMPANY") {
    redirect(ROUTES.HOME);
  }

  if (!session.user.companyId) {
    redirect(getDynamicRoute.registerWithError("CompleteProfile"));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className="pt-8 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Post a Job</h1>
          <p className="mt-2 text-muted-foreground">
            Create a new job listing to find the perfect candidates
          </p>
        </div>

        <JobPostingForm />
      </div>
    </div>
  );
}
