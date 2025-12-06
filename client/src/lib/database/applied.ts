import { cache } from "react";
import { logger } from "../logger";

export const checkHasApplied = cache(async (id: number, token: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/check/applied/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    return data as number;
  } catch (error) {
    logger.error(`Error while fetching job of id ${id} ${(error as Error)?.message}`);
    return null;
  }
});
