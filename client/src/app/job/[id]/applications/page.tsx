import ApplicationUserCard from "@/components/jobs/application-user-card";
import Navbar from "@/components/layouts/navbar";
import { Button } from "@/components/ui";
import { EmptyState } from "@/components/ui/empty-state";
import { getJobApplications, rankAppplicant } from "@/lib/database/firestore-server";
import { FileText } from "lucide-react";
import { cookies } from "next/headers";

export default async function JobApplicationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const cookieStore = cookies();
  const authToken = (await cookieStore).get(process.env.AUTH_COOKIE_TOKEN_NAME || "auth-token");
  const applications = await getJobApplications(authToken?.value || "", +id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className="pt-8 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Applications for {applications?.[0].jobId.title}</h1>
          <p className="mt-2 text-muted-foreground">{applications?.length} applicants</p>
        </div>

        <Button
          className="my-2"
          variant="outline"
          onClick={async () => {
            const ranking = await rankAppplicant(authToken?.value || "", +id);
            console.log(ranking);
          }}
        >
          Rank with KaamAI
        </Button>

        {applications && applications.length > 0 ? (
          <>
            <ul>
              {applications.map((application) => (
                <ApplicationUserCard
                  key={application.id}
                  resumeLink={application.usedResume}
                  user={application.userId}
                  status={application.status}
                />
              ))}
            </ul>
          </>
        ) : (
          <EmptyState
            icon={FileText}
            title="No applications yet"
            description="Start applying to jobs to see your applications here."
            actionLabel="Browse Jobs"
            actionHref="/"
          />
        )}
      </div>
    </div>
  );
}
