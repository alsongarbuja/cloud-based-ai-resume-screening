import { userConnected } from "@/utils/userConnected";
import Navbar from "@/components/layouts/navbar";
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { getJobsByCompanyId } from "@/lib/database/firestore";
import CompanyJobListings from "@/components/jobs/company-job-listings";
import { ROUTES, getDynamicRoute } from "@/config/routes";

export default async function MyJobsPage() {
  await userConnected();

  const session = await auth();
  
  if (!session?.user || session.user.userType !== "COMPANY") {
    redirect(ROUTES.HOME);
  }

  if (!session.user.companyId) {
    redirect(getDynamicRoute.registerWithError("CompleteProfile"));
  }

  const jobs = await getJobsByCompanyId(session.user.companyId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className="pt-8 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Job Listings</h1>
          <p className="mt-2 text-muted-foreground">
            Manage all the jobs you've posted
          </p>
        </div>

        <CompanyJobListings jobs={jobs} />
      </div>
    </div>
  );
}
