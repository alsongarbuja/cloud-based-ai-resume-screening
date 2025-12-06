import { NextRequest } from "next/server";
import { z } from "zod";
import { withCompanyAuth } from "@/lib/middleware/auth";
import { successResponse, handleApiError } from "@/lib/middleware/api-response";
import { NotFoundError, ForbiddenError } from "@/lib/errors";
import { HTTP_STATUS, VALIDATION } from "@/config/constants";
import { logger } from "@/lib/logger";
import { adminDb, isAdminSdkAvailable } from "@/lib/database/firebase-admin";
import { getJobById } from "@/lib/database/profile";
import { Timestamp } from "firebase-admin/firestore";

const updateJobSchema = z
  .object({
    jobTitle: z
      .string()
      .min(VALIDATION.JOB_TITLE_MIN_LENGTH, "Job title is required")
      .max(VALIDATION.JOB_TITLE_MAX_LENGTH, "Job title is too long")
      .trim(),
    jobDescription: z
      .string()
      .min(
        VALIDATION.JOB_DESCRIPTION_MIN_LENGTH,
        `Job description must be at least ${VALIDATION.JOB_DESCRIPTION_MIN_LENGTH} characters`
      )
      .max(VALIDATION.JOB_DESCRIPTION_MAX_LENGTH, "Job description is too long")
      .trim(),
    employmentType: z.string().min(1, "Employment type is required"),
    location: z.string().min(1, "Location is required").trim(),
    salaryFrom: z.coerce
      .number()
      .min(VALIDATION.MIN_SALARY, "Minimum salary cannot be negative")
      .max(VALIDATION.MAX_SALARY, "Minimum salary is too high"),
    salaryTo: z.coerce
      .number()
      .min(VALIDATION.MIN_SALARY, "Maximum salary cannot be negative")
      .max(VALIDATION.MAX_SALARY, "Maximum salary is too high"),
    benefits: z.array(z.string()).optional(),
    status: z.enum(["DRAFT", "ACTIVE"]).optional(),
  })
  .refine((data) => data.salaryTo >= data.salaryFrom, {
    message: "Maximum salary must be greater than or equal to minimum salary",
    path: ["salaryTo"],
  });

/**
 * PUT /api/jobs/[id] - Update a job posting
 * Only the company that created the job can update it
 */
export const PUT = withCompanyAuth(
  async (request: NextRequest, session, context?: { params: { id: string } }) => {
    if (!isAdminSdkAvailable || !adminDb) {
      throw new Error("Firebase Admin SDK not available");
    }

    const jobId = context?.params?.id;
    if (!jobId) {
      throw new Error("Job ID is required");
    }

    logger.api("PUT", `/api/jobs/${jobId}`);

    const existingJob = await getJobById(jobId);

    if (!existingJob) {
      throw new NotFoundError("Job not found");
    }

    if (existingJob.companyId !== session.user.companyId) {
      logger.warn("Unauthorized job update attempt", {
        context: {
          userId: session.user.id,
          companyId: session.user.companyId,
          jobCompanyId: existingJob.companyId,
        },
      });
      throw new ForbiddenError("You can only update your own jobs");
    }

    const body = await request.json();
    const validatedData = updateJobSchema.parse(body);

    const jobRef = adminDb.collection("jobs").doc(jobId);
    await jobRef.update({
      ...validatedData,
      updatedAt: Timestamp.now(),
    });

    logger.info("Job updated successfully", {
      context: { jobId, companyId: session.user.companyId },
    });

    return successResponse({
      jobId,
      message: "Job updated successfully",
    });
  }
);

/**
 * GET /api/jobs/[id] - Get a single job by ID
 * Public endpoint - no authentication required
 */
export async function GET(_request: NextRequest, context: { params: { id: string } }) {
  try {
    const jobId = context.params.id;

    logger.api("GET", `/api/jobs/${jobId}`);

    const job = await getJobById(jobId);

    if (!job) {
      throw new NotFoundError("Job not found");
    }

    return successResponse(job, HTTP_STATUS.OK);
  } catch (error) {
    return handleApiError(error);
  }
}
