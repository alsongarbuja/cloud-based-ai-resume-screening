import "server-only";
import { cache } from "react";
import { Applied, User } from "@/types";

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
