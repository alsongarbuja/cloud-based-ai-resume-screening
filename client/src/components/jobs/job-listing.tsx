"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getJobs } from "@/lib/database/firestore";
import { CACHE, PAGINATION } from "@/config/constants";
import JobCard from "./job-card";
import { JobCardSkeletonList } from "@/components/ui/skeletons";

interface JobListingProps {
  currentPage: number;
  jobTypes: string[];
  timePosted: string;
  isPublic?: boolean;
}

const JobListing = ({ currentPage, jobTypes, timePosted, isPublic = false }: JobListingProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["jobs", currentPage, jobTypes, timePosted],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs`);
      const data = await res.json();
      return data;
    },
    staleTime: CACHE.QUERY_STALE_TIME,
    gcTime: CACHE.QUERY_GC_TIME,
  });

  const jobs = data || [];
  // const hasMore = data?.hasMore || false;

  if (isLoading) {
    return <JobCardSkeletonList count={5} />;
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🔍</span>
        </div>
        <h3 className="text-lg font-medium mb-2">No jobs found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or search criteria.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {jobs.map((job: any) => (
        <JobCard key={job.id} job={job} isPublic={isPublic} />
      ))}

      <div className="text-center py-4 text-sm text-muted-foreground">
        {jobs.length} jobs found
        {/* {hasMore && "(more available)"} */}
      </div>
    </div>
  );
};

export default JobListing;
