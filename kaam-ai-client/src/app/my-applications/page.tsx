import { userConnected } from "@/utils/userConnected";
import Navbar from "@/components/layouts/navbar";
import { EmptyState } from "@/components/ui/empty-state";
import { FileText } from "lucide-react";

export default async function MyApplicationsPage() {
  await userConnected();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className="pt-8 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Applications</h1>
          <p className="mt-2 text-muted-foreground">
            Track all your job applications and their status
          </p>
        </div>

        <EmptyState
          icon={FileText}
          title="No applications yet"
          description="Start applying to jobs to see your applications here."
          actionLabel="Browse Jobs"
          actionHref="/"
        />
      </div>
    </div>
  );
}