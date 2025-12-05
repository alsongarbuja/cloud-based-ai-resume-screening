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
