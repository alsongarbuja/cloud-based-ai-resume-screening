import "server-only";
import { cache } from "react";
import { dynamicObj, Job } from "@/types";
import { logger } from "../logger";
import { toQueryString } from "@/utils/db";

export const getJobs = cache(async (filter: dynamicObj) => {
  try {
    const parameters = toQueryString(filter);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs${parameters}`);
    const data = await res.json();

    return {
      jobs: data as Job[],
      status: 200,
    };
  } catch (error: unknown) {
    logger.error(`Error while fetching jobs ${(error as Error)?.message}`);
    return { jobs: [] };
  }
});

export const getJobById = cache(async (id: number) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/${id}`);
    const data = await res.json();

    return data as Job;
  } catch (error) {
    logger.error(`Error while fetching job of id ${id} ${(error as Error)?.message}`);
  }
});

export const checkHasSaved = cache(async (jobId: number, token: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/check/saved/${jobId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    return data as number;
  } catch (error) {
    logger.error(`Error while checking saved job of id ${jobId} ${(error as Error)?.message}`);
    return null;
  }
});
