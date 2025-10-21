import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  QueryConstraint
} from "firebase/firestore";
import { db } from "./firebase";
import type { User, Company, JobSeeker, Job, JobApplication } from "@/types";
import { timestampToDate } from "./timestamp-utils";

export type { User, Company, JobSeeker, Job, JobApplication };

export const createUser = async (userData: Omit<User, "id" | "createdAt" | "updatedAt">) => {
  const now = new Date();
  const docRef = await addDoc(collection(db, "users"), {
    ...userData,
    createdAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
  });
  return docRef.id;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const q = query(collection(db, "users"), where("email", "==", email));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) return null;
  
  const doc = querySnapshot.docs[0];
  const data = doc.data();
  
  return {
    id: doc.id,
    ...data,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
    emailVerified: data.emailVerified ? timestampToDate(data.emailVerified) : undefined,
  } as User;
};

export const getUserById = async (id: string): Promise<User | null> => {
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) return null;
  
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
    emailVerified: data.emailVerified ? timestampToDate(data.emailVerified) : undefined,
  } as User;
};

export const updateUser = async (id: string, userData: Partial<User>) => {
  const docRef = doc(db, "users", id);
  await setDoc(docRef, {
    ...userData,
    updatedAt: Timestamp.fromDate(new Date()),
  }, { merge: true });
};

export const createCompany = async (companyData: Omit<Company, "id" | "createdAt" | "updatedAt">) => {
  const now = new Date();
  const docRef = await addDoc(collection(db, "companies"), {
    ...companyData,
    createdAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
  });
  return docRef.id;
};

export const getCompanyByUserId = async (userId: string): Promise<Company | null> => {
  const q = query(collection(db, "companies"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) return null;
  
  const doc = querySnapshot.docs[0];
  const data = doc.data();
  
  return {
    id: doc.id,
    ...data,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  } as Company;
};

export const createJobSeeker = async (jobSeekerData: Omit<JobSeeker, "id" | "createdAt" | "updatedAt">) => {
  const now = new Date();
  const docRef = await addDoc(collection(db, "jobSeekers"), {
    ...jobSeekerData,
    createdAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
  });
  return docRef.id;
};

export const getJobSeekerByUserId = async (userId: string): Promise<JobSeeker | null> => {
  const q = query(collection(db, "jobSeekers"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) return null;
  
  const doc = querySnapshot.docs[0];
  const data = doc.data();
  
  return {
    id: doc.id,
    ...data,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  } as JobSeeker;
};

export const createJob = async (jobData: Omit<Job, "id" | "createdAt" | "updatedAt">) => {
  const now = new Date();
  const docRef = await addDoc(collection(db, "jobs"), {
    ...jobData,
    createdAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
  });
  return docRef.id;
};

export const getJobs = async (filters?: {
  employmentType?: string[];
  timePosted?: string; 
  page?: number;
  limit?: number;
}): Promise<{ jobs: Job[]; hasMore: boolean }> => {
  const baseQuery = collection(db, "jobs");

  const conditions: QueryConstraint[] = [
    where("status", "==", "ACTIVE"),
  ];

  if (filters?.employmentType && filters.employmentType.length > 0) {
    conditions.push(where("employmentType", "in", filters.employmentType));
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

    conditions.push(where("createdAt", ">=", Timestamp.fromDate(cutoffDate)));
  }

  let q = query(
    baseQuery,
    ...conditions,
    orderBy("createdAt", "desc")
  );

  const limitCount = filters?.limit || 10;
  q = query(q, limit(limitCount + 1)); 

  try {
    const querySnapshot = await getDocs(q);
    const jobsResult: Job[] = [];

    const companyIds = new Set<string>();
    const jobsData = querySnapshot.docs.slice(0, limitCount).map(docSnap => {
      const data = docSnap.data();
      companyIds.add(data.companyId);
      return { id: docSnap.id, data };
    });

    const companyMap = new Map<string, Company>();
    const companyPromises = Array.from(companyIds).map(async (companyId) => {
      const companyDoc = await getDoc(doc(db, "companies", companyId));
      if (companyDoc.exists()) {
        companyMap.set(companyId, {
          id: companyDoc.id,
          ...companyDoc.data(),
          createdAt: timestampToDate(companyDoc.data()?.createdAt),
          updatedAt: timestampToDate(companyDoc.data()?.updatedAt),
        } as Company);
      }
    });
    
    await Promise.all(companyPromises);

    for (const { id, data } of jobsData) {
      jobsResult.push({
        id,
        ...data,
        createdAt: timestampToDate(data.createdAt),
        updatedAt: timestampToDate(data.updatedAt),
        company: companyMap.get(data.companyId),
      } as Job);
    }

    return {
      jobs: jobsResult,
      hasMore: querySnapshot.docs.length > limitCount,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("requires an index") || msg.includes("index")) {
      const baseConditions: QueryConstraint[] = [where("status", "==", "ACTIVE")];

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
        
        baseConditions.push(where("createdAt", ">=", Timestamp.fromDate(cutoffDate)));
      }

      let fallbackQ = query(collection(db, "jobs"), ...baseConditions, orderBy("createdAt", "desc"));
      fallbackQ = query(fallbackQ, limit(limitCount + 1));

      const fallbackSnapshot = await getDocs(fallbackQ);
      const filteredJobs: Job[] = [];

      const companyIds = new Set<string>();
      const matchingJobsData: Array<{id: string, data: Record<string, unknown>}> = [];
      
      for (const docSnap of fallbackSnapshot.docs) {
        const data = docSnap.data();

        if (filters?.employmentType && filters.employmentType.length > 0) {
          if (!filters.employmentType.includes(data.employmentType)) continue;
        }

        matchingJobsData.push({ id: docSnap.id, data });
        companyIds.add(data.companyId);
        
        if (matchingJobsData.length >= limitCount) break;
      }

      const companyMap = new Map<string, Company>();
      const companyPromises = Array.from(companyIds).map(async (companyId) => {
        const companyDoc = await getDoc(doc(db, "companies", companyId));
        if (companyDoc.exists()) {
          companyMap.set(companyId, {
            id: companyDoc.id,
            ...companyDoc.data(),
            createdAt: timestampToDate(companyDoc.data()?.createdAt),
            updatedAt: timestampToDate(companyDoc.data()?.updatedAt),
          } as Company);
        }
      });
      
      await Promise.all(companyPromises);

      for (const { id, data } of matchingJobsData) {
        const jobData = data as Record<string, unknown> & { createdAt: unknown; updatedAt: unknown; companyId: string };
        filteredJobs.push({
          id,
          ...data,
          createdAt: timestampToDate(jobData.createdAt),
          updatedAt: timestampToDate(jobData.updatedAt),
          company: companyMap.get(jobData.companyId),
        } as Job);
      }

      return {
        jobs: filteredJobs,
        hasMore: fallbackSnapshot.docs.length > limitCount,
      };
    }

      throw err;
    }
};

export const getJobById = async (id: string): Promise<Job | null> => {
  const docRef = doc(db, "jobs", id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) return null;
  
  const data = docSnap.data();
  
  const companyDoc = await getDoc(doc(db, "companies", data.companyId));
  const companyData = companyDoc.exists() ? {
    id: companyDoc.id,
    ...companyDoc.data(),
    createdAt: timestampToDate(companyDoc.data()?.createdAt),
    updatedAt: timestampToDate(companyDoc.data()?.updatedAt),
  } as Company : undefined;

  return {
    id: docSnap.id,
    ...data,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
    company: companyData,
  } as Job;
};

export const getJobsByCompanyId = async (companyId: string): Promise<Job[]> => {
  const q = query(
    collection(db, "jobs"), 
    where("companyId", "==", companyId),
    orderBy("createdAt", "desc")
  );
  
  const querySnapshot = await getDocs(q);
  const jobs: Job[] = [];

  for (const docSnap of querySnapshot.docs) {
    const data = docSnap.data();
    jobs.push({
      id: docSnap.id,
      ...data,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    } as Job);
  }

  return jobs;
};

export const saveJob = async (userId: string, jobId: string) => {
  const now = new Date();
  await addDoc(collection(db, "savedJobs"), {
    userId,
    jobId,
    createdAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
  });
};

export const unsaveJob = async (userId: string, jobId: string) => {
  const q = query(
    collection(db, "savedJobs"), 
    where("userId", "==", userId),
    where("jobId", "==", jobId)
  );
  
  const querySnapshot = await getDocs(q);
  for (const docSnap of querySnapshot.docs) {
    await deleteDoc(docSnap.ref);
  }
};

export const getSavedJobs = async (userId: string): Promise<Job[]> => {
  const q = query(
    collection(db, "savedJobs"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);

  const jobIds = querySnapshot.docs.map(doc => doc.data().jobId);

  const jobPromises = jobIds.map(jobId => getJobById(jobId));
  const jobsResults = await Promise.all(jobPromises);

  const jobs = jobsResults.filter((job): job is Job => job !== null);

  return jobs;
};

export const isJobSaved = async (userId: string, jobId: string): Promise<boolean> => {
  const q = query(
    collection(db, "savedJobs"), 
    where("userId", "==", userId),
    where("jobId", "==", jobId)
  );
  
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

export const createJobApplication = async (applicationData: Omit<JobApplication, "id" | "createdAt" | "updatedAt">) => {
  const now = new Date();
  const docRef = await addDoc(collection(db, "jobApplications"), {
    ...applicationData,
    createdAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
  });
  return docRef.id;
};

export const getJobApplicationsByJobSeeker = async (jobSeekerId: string): Promise<JobApplication[]> => {
  const q = query(
    collection(db, "jobApplications"), 
    where("jobSeekerId", "==", jobSeekerId),
    orderBy("createdAt", "desc")
  );
  
  const querySnapshot = await getDocs(q);
  const applications: JobApplication[] = [];

  for (const docSnap of querySnapshot.docs) {
    const data = docSnap.data();
    applications.push({
      id: docSnap.id,
      ...data,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    } as JobApplication);
  }

  return applications;
};

export const getJobApplicationsByJob = async (jobId: string): Promise<JobApplication[]> => {
  const q = query(
    collection(db, "jobApplications"), 
    where("jobId", "==", jobId),
    orderBy("createdAt", "desc")
  );
  
  const querySnapshot = await getDocs(q);
  const applications: JobApplication[] = [];

  for (const docSnap of querySnapshot.docs) {
    const data = docSnap.data();
    applications.push({
      id: docSnap.id,
      ...data,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    } as JobApplication);
  }

  return applications;
};