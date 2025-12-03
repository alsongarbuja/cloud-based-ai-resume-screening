import { Suspense } from "react";
// import { auth } from "@/lib/auth/config";
// import Navbar from "@/components/layouts/navbar";
import { JobDetailContent } from "./job-detail-content";
import { Skeleton } from "@/components/ui/skeleton";
import { cookies } from "next/headers";

type Params = Promise<{ id: string }>;

export const revalidate = 60;

function JobContentSkeleton() {
  return (
    <div className="py-8 pb-12">
      <Skeleton className="h-4 w-24 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-8 col-1 md:col-span-2">
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="border rounded-lg p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function JobDetailPage({ params }: { params: Params }) {
  // const session = await auth();
  const { id } = await params;
  const cookieStore = cookies();
  const authToken = (await cookieStore).get(process.env.AUTH_COOKIE_TOKEN_NAME || "auth-token");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* <Navbar /> */}
      <Suspense fallback={<JobContentSkeleton />}>
        <JobDetailContent id={parseInt(id)} token={authToken?.value || ""} />
      </Suspense>
    </div>
  );
}
