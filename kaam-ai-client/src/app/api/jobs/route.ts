import { NextRequest } from "next/server";
import { z } from "zod";
import { withCompanyAuth } from "@/lib/middleware/auth";
import { successResponse } from "@/lib/middleware/api-response";
import { HTTP_STATUS, VALIDATION } from "@/config/constants";
import { logger } from "@/lib/logger";
import { adminDb, isAdminSdkAvailable } from "@/lib/database/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

const createJobSchema = z.object({
  jobTitle: z.string()
    .min(VALIDATION.JOB_TITLE_MIN_LENGTH, "Job title is required")
    .max(VALIDATION.JOB_TITLE_MAX_LENGTH, "Job title is too long")
    .trim(),
  jobDescription: z.string()
    .min(VALIDATION.JOB_DESCRIPTION_MIN_LENGTH, `Job description must be at least ${VALIDATION.JOB_DESCRIPTION_MIN_LENGTH} characters`)
    .max(VALIDATION.JOB_DESCRIPTION_MAX_LENGTH, "Job description is too long")
    .trim(),
  employmentType: z.string().min(1, "Employment type is required"),
  location: z.string().min(1, "Location is required").trim(),
  salaryFrom: z.coerce.number()
    .min(VALIDATION.MIN_SALARY, "Minimum salary cannot be negative")
    .max(VALIDATION.MAX_SALARY, "Minimum salary is too high"),
  salaryTo: z.coerce.number()
    .min(VALIDATION.MIN_SALARY, "Maximum salary cannot be negative")
    .max(VALIDATION.MAX_SALARY, "Maximum salary is too high"),
  listingDuration: z.coerce.number()
    .min(VALIDATION.MIN_LISTING_DURATION, `Duration must be at least ${VALIDATION.MIN_LISTING_DURATION} day`)
    .max(VALIDATION.MAX_LISTING_DURATION, `Duration cannot exceed ${VALIDATION.MAX_LISTING_DURATION} days`),
  benefits: z.array(z.string()).default([]),
  status: z.enum(["DRAFT", "ACTIVE"]).default("ACTIVE"),
}).refine((data) => data.salaryTo >= data.salaryFrom, {
  message: "Maximum salary must be greater than or equal to minimum salary",
  path: ["salaryTo"],
});

// create new jobs
export const POST = withCompanyAuth(async (request: NextRequest, session) => {
  if (!isAdminSdkAvailable || !adminDb) {
    throw new Error('Firebase Admin SDK not available');
  }

  logger.api('POST', '/api/jobs');

  const body = await request.json();
  const validatedData = createJobSchema.parse(body);

  const now = Timestamp.now();
  const jobData = {
    ...validatedData,
    companyId: session.user.companyId,
    createdAt: now,
    updatedAt: now,
  };

  const jobRef = await adminDb.collection("jobs").add(jobData);
  const jobId = jobRef.id;

  logger.info('Job created successfully', {
    context: {
      jobId,
      companyId: session.user.companyId,
      status: validatedData.status,
    },
  });

  return successResponse(
    {
      jobId,
      message: validatedData.status === "DRAFT" ? "Job saved as draft" : "Job posted successfully",
    },
    HTTP_STATUS.CREATED
  );
});
