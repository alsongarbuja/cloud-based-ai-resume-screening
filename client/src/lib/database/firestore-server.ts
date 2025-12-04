import "server-only";
import { cache } from "react";
import type { User, Company, JobSeeker, Job, JobApplication } from "./firestore";
import { Applied } from "@/types";

export const getUserByEmail = cache(async (email: string): Promise<User | null> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/by-email/${encodeURIComponent(email)}`
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data as User;
});

export const getUserProfile = cache(async (token: string): Promise<User | null> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile`, {
    headers: {
      Cookie: `auth-token=${token}`,
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data as User;
});

export const getMyApplications = cache(async (token: string): Promise<Applied[] | null> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/applications`, {
    headers: {
      Cookie: `auth-token=${token}`,
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data as Applied[];
});

export const getJobApplications = cache(
  async (token: string, jobId: number): Promise<Applied[] | null> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/applied/job/${jobId}`, {
      headers: {
        Cookie: `auth-token=${token}`,
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data as Applied[];
  }
);

export const rankAppplicant = cache(async (token: string, jobId: number) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/predict`, {
    method: "POST",
    body: JSON.stringify({ jobId }),
    headers: {
      "Content-Type": "application/json",
      Cookie: `auth-token=${token}`,
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data;
});

export const getCompanyById = cache(async (id: string): Promise<Company | null> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/companies/${id}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data as Company;
});

export const getCompanyByUserId = cache(async (userId: string): Promise<Company | null> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/companies/by-user/${userId}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data as Company;
});

export const getJobSeekerByUserId = cache(async (userId: string): Promise<JobSeeker | null> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/job-seekers/by-user/${userId}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data as JobSeeker;
});

export const getJobs = cache(
  async (filters?: {
    employmentType?: string[];
    timePosted?: string;
    page?: number;
    limit?: number;
  }): Promise<{ jobs: Job[]; hasMore: boolean }> => {
    const params = new URLSearchParams();

    if (filters?.employmentType && filters.employmentType.length > 0) {
      filters.employmentType.forEach((type) => params.append("employmentType", type));
    }

    if (filters?.timePosted && filters.timePosted !== "all") {
      params.append("timePosted", filters.timePosted);
    }

    if (filters?.page) {
      params.append("page", filters.page.toString());
    }

    if (filters?.limit) {
      params.append("limit", filters.limit.toString());
    }

    const queryString = params.toString();
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url);
    if (!res.ok) return { jobs: [], hasMore: false };

    const data = await res.json();
    return data as { jobs: Job[]; hasMore: boolean };
  }
);

export const getJobById = cache(async (id: string): Promise<Job | null> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/${id}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data as Job;
});

export const getJobsByCompanyId = cache(async (companyId: string): Promise<Job[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/by-company/${companyId}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data as Job[];
});

export const getSavedJobs = cache(async (userId: string): Promise<Job[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/saved-jobs/by-user/${userId}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data as Job[];
});

export const isJobSaved = cache(async (userId: string, jobId: string): Promise<boolean> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/saved-jobs/check/${userId}/${jobId}`
  );
  if (!res.ok) return false;
  const data = await res.json();
  return data.isSaved as boolean;
});

export const getJobApplicationsByJobSeeker = cache(
  async (jobSeekerId: string): Promise<JobApplication[]> => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/job-applications/by-job-seeker/${jobSeekerId}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data as JobApplication[];
  }
);

export const getJobApplicationsByJob = cache(async (jobId: string): Promise<JobApplication[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/job-applications/by-job/${jobId}`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data as JobApplication[];
});
