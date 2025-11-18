import { auth } from "@/lib/auth/config";
import { getJobById as getJobByIdClient } from "@/lib/database/firestore";
import { getJobById as getJobByIdServer, isAdminSdkAvailable } from "@/lib/database/firestore-server";
import { redirect } from "next/navigation";
import Navbar from "@/components/layouts/navbar";
import dynamic from "next/dynamic";
import { ROUTES } from "@/config/routes";

const EditJobForm = dynamic(
  () =>
    import("@/components/jobs/edit-job-form").then((mod) => ({
      default: mod.EditJobForm,
    })),
  {
    loading: () => (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ),
  }
);

type Params = Promise<{ id: string }>;

export default async function EditJobPage({ params }: { params: Params }) {
  const session = await auth();
  const { id } = await params;

  // Check if user is authenticated and is a company user
  if (!session?.user || session.user.userType !== "COMPANY") {
    return redirect(ROUTES.LOGIN);
  }

  // Get the job
  const job = isAdminSdkAvailable
    ? await getJobByIdServer(id)
    : await getJobByIdClient(id);

  if (!job) {
    return redirect(ROUTES.MY_JOBS);
  }

  // Check if the user owns this job
  if (job.companyId !== session.user.companyId) {
    return redirect(ROUTES.MY_JOBS);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className="py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Edit Job</h1>
            <p className="text-muted-foreground mt-2">
              Update your job posting details
            </p>
          </div>
          
          <EditJobForm job={job} />
        </div>
      </div>
    </div>
  );
}