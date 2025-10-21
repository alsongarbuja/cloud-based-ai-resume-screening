declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      userType?: "COMPANY" | "JOB_SEEKER"
      onboardingComplete?: boolean
      companyId?: string
      jobSeekerId?: string
      isNewUser?: boolean
    }
  }

  interface User {
    id: string
    userType?: "COMPANY" | "JOB_SEEKER"
    onboardingComplete?: boolean
    companyId?: string
    jobSeekerId?: string
    isNewUser?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userType?: "COMPANY" | "JOB_SEEKER"
    onboardingComplete?: boolean
    companyId?: string
    jobSeekerId?: string
    isNewUser?: boolean
  }
}

export {};
