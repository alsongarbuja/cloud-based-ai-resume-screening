export interface User {
  id: string;
  username?: string;
  email: string;
  // emailVerified?: Date;
  profilePic?: string;
  type?: "ORG" | "USER";
  // onboardingComplete: boolean;
  // companyId?: string;
  // jobSeekerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  name: string;
  location: string;
  about: string;
  website: string;
  logo: string;
  xAccount?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobSeeker {
  id: string;
  name: string;
  about: string;
  resume: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Job {
  id: string;
  jobTitle: string;
  jobDescription: string;
  employmentType: string;
  location: string;
  salaryFrom: number;
  salaryTo: number;
  listingDuration: number;
  benefits: string[];
  status: "DRAFT" | "ACTIVE" | "EXPIRED";
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
  company?: Company;
}

export interface SavedJob {
  id: string;
  jobId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobSeekerId: string;
  resume: string;
  coverLetter?: string;
  prevPosition?: string;
  prevCompany?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserType = "COMPANY" | "JOB_SEEKER";
export type JobStatus = "DRAFT" | "ACTIVE" | "EXPIRED";
