import "server-only";
import { cache } from "react";
import { Result } from "@/types";

const COOKIE_TOKEN_NAME = process.env.AUTH_COOKIE_TOKEN_NAME || "kaam-ai-auth-token";

export const getJobResult = cache(async (token: string, jobId: number): Promise<Result | null> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/results/${jobId}`, {
    headers: {
      Cookie: `${COOKIE_TOKEN_NAME}=${token}`,
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data as Result;
});

export const checkResult = cache(async (token: string, jobId: number): Promise<boolean> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/results/${jobId}/check`, {
    headers: {
      Cookie: `${COOKIE_TOKEN_NAME}=${token}`,
    },
  });
  if (!res.ok) return false;
  const data = await res.json();
  return data as boolean;
});
