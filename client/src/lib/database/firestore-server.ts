import "server-only";
import { cache } from "react";
import { adminDb, isAdminSdkAvailable } from "./firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import type { User, Company, JobSeeker, Job, JobApplication } from "./firestore";
import { timestampToDate } from "./timestamp-utils";

export { isAdminSdkAvailable };


export const getUserByEmail = cache(async (email: string): Promise<User | null> => {
  if (!adminDb) return null;

  const snapshot = await adminDb.collection("users").where("email", "==", email).limit(1).get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  const data = doc.data();

  return {
    id: doc.id,
    ...data,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
    emailVerified: data.emailVerified ? timestampToDate(data.emailVerified) : undefined,
  } as User;
});

export const getUserById = cache(async (id: string): Promise<User | null> => {
  if (!adminDb) return null;

  const doc = await adminDb.collection("users").doc(id).get();

  if (!doc.exists) return null;

  const data = doc.data()!;
  return {
    id: doc.id,
    ...data,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
    emailVerified: data.emailVerified ? timestampToDate(data.emailVerified) : undefined,
  } as User;
});


export const getCompanyById = cache(async (id: string): Promise<Company | null> => {
  if (!adminDb) return null;

  const doc = await adminDb.collection("companies").doc(id).get();

  if (!doc.exists) return null;

  const data = doc.data()!;
  return {
    id: doc.id,
    ...data,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  } as Company;
});

export const getCompanyByUserId = cache(async (userId: string): Promise<Company | null> => {
  if (!adminDb) return null;

  const snapshot = await adminDb
    .collection("companies")
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  const data = doc.data();

  return {
    id: doc.id,
    ...data,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  } as Company;
});

export const getJobSeekerByUserId = cache(async (userId: string): Promise<JobSeeker | null> => {
  if (!adminDb) return null;

  const snapshot = await adminDb
    .collection("jobSeekers")
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  const data = doc.data();

  return {
    id: doc.id,
    ...data,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  } as JobSeeker;
});


export const getJobs = cache(
  async (filters?: {
    employmentType?: string[];
    timePosted?: string; 
    page?: number;
    limit?: number;
  }): Promise<{ jobs: Job[]; hasMore: boolean }> => {
    console.log("🔍 Server getJobs called with filters:", JSON.stringify(filters, null, 2));
    console.log("🔍 Cache key:", JSON.stringify(filters));
    
    if (!adminDb) return { jobs: [], hasMore: false };

    let query: FirebaseFirestore.Query = adminDb.collection("jobs");

    query = query.where("status", "==", "ACTIVE");

    if (filters?.employmentType && filters.employmentType.length > 0) {
      console.log("💼 Adding employmentType filter:", filters.employmentType);
      query = query.where("employmentType", "in", filters.employmentType);
    }

    if (filters?.timePosted && filters.timePosted !== "all") {
      const now = new Date();
      let cutoffDate: Date;
      
      switch (filters.timePosted) {
        case "1h":
          cutoffDate = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case "24h":
          cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case "7d":
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30d":
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "90d":
          cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          cutoffDate = new Date(0); 
      }
      
      console.log("⏰ Adding timePosted filter:", filters.timePosted, "cutoff:", cutoffDate);
      query = query.where("createdAt", ">=", Timestamp.fromDate(cutoffDate));
    }

    query = query.orderBy("createdAt", "desc");
    const limitCount = filters?.limit || 10;
    query = query.limit(limitCount + 1);

    let snapshot;
    try {
      snapshot = await query.get();
      console.log("📊 Query returned", snapshot.docs.length, "documents");

      snapshot.docs.slice(0, 3).forEach(doc => {
        const data = doc.data();
        console.log(`  - Job: "${data.jobTitle}" | Location: "${data.location}" | Status: "${data.status}"`);
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "";
      if (errorMessage.includes("index") || errorMessage.includes("requires an index")) {
        console.log("⚠️  Firestore index required, falling back to client-side filtering");

        let fallbackQuery = adminDb.collection("jobs")
          .where("status", "==", "ACTIVE");

        if (filters?.timePosted && filters.timePosted !== "all") {
          const now = new Date();
          let cutoffDate: Date;
          
          switch (filters.timePosted) {
            case "1h":
              cutoffDate = new Date(now.getTime() - 60 * 60 * 1000);
              break;
            case "24h":
              cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
              break;
            case "7d":
              cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              break;
            case "30d":
              cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
              break;
            case "90d":
              cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
              break;
            default:
              cutoffDate = new Date(0);
          }
          
          fallbackQuery = fallbackQuery.where("createdAt", ">=", Timestamp.fromDate(cutoffDate));
        }
        
        fallbackQuery = fallbackQuery
          .orderBy("createdAt", "desc")
          .limit((limitCount + 1) * 3); 

        snapshot = await fallbackQuery.get();
        console.log("📊 Fallback query returned", snapshot.docs.length, "documents");
      } else {
        throw error; 
      }
    }

    const companyIds = new Set<string>();
    const jobsData: Array<{ id: string; data: FirebaseFirestore.DocumentData }> = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();

      if (filters?.employmentType && filters.employmentType.length > 0) {
        if (!filters.employmentType.includes(data.employmentType)) {
          continue;
        }
      }

      companyIds.add(data.companyId);
      jobsData.push({ id: doc.id, data });

      if (jobsData.length >= limitCount) {
        break;
      }
    }

    console.log("✅ After client-side filtering:", jobsData.length, "jobs match");

    const companyPromises = Array.from(companyIds).map((id) => getCompanyById(id));
    const companies = await Promise.all(companyPromises);
    const companyMap = new Map(companies.filter(Boolean).map((c) => [c!.id, c]));

    const jobs: Job[] = jobsData.map(({ id, data }) => ({
      id,
      ...data,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
      company: companyMap.get(data.companyId),
    })) as Job[];

    return {
      jobs,
      hasMore: snapshot.docs.length > limitCount,
    };
  }
);

export const getJobById = cache(async (id: string): Promise<Job | null> => {
  if (!adminDb) return null;

  const doc = await adminDb.collection("jobs").doc(id).get();

  if (!doc.exists) return null;

  const data = doc.data()!;
  const company = await getCompanyById(data.companyId);

  return {
    id: doc.id,
    ...data,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
    company,
  } as Job;
});

export const getJobsByCompanyId = cache(async (companyId: string): Promise<Job[]> => {
  if (!adminDb) return [];

  const snapshot = await adminDb
    .collection("jobs")
    .where("companyId", "==", companyId)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    } as Job;
  });
});


export const getSavedJobs = cache(async (userId: string): Promise<Job[]> => {
  if (!adminDb) return [];

  const snapshot = await adminDb
    .collection("savedJobs")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  const jobIds = snapshot.docs.map((doc) => doc.data().jobId);
  const jobs = await Promise.all(jobIds.map((id) => getJobById(id)));

  return jobs.filter(Boolean) as Job[];
});

export const isJobSaved = cache(async (userId: string, jobId: string): Promise<boolean> => {
  if (!adminDb) return false;

  const snapshot = await adminDb
    .collection("savedJobs")
    .where("userId", "==", userId)
    .where("jobId", "==", jobId)
    .limit(1)
    .get();

  return !snapshot.empty;
});

export const getJobApplicationsByJobSeeker = cache(
  async (jobSeekerId: string): Promise<JobApplication[]> => {
    if (!adminDb) return [];

    const snapshot = await adminDb
      .collection("jobApplications")
      .where("jobSeekerId", "==", jobSeekerId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: timestampToDate(data.createdAt),
        updatedAt: timestampToDate(data.updatedAt),
      } as JobApplication;
    });
  }
);

export const getJobApplicationsByJob = cache(async (jobId: string): Promise<JobApplication[]> => {
  if (!adminDb) return [];

  const snapshot = await adminDb
    .collection("jobApplications")
    .where("jobId", "==", jobId)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    } as JobApplication;
  });
});
