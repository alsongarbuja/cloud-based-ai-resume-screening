"use server";

// import { auth } from "@/lib/auth/config";
import { updateUser, createCompany, createJobSeeker, User } from "@/lib/database/firestore";

export async function completeOnboarding(user: User) {
  // const session = await auth();

  // if (!session?.user?.id) {
  //   throw new Error("Not authenticated");
  // }

  // if (session.user.onboardingComplete) {
  //   throw new Error("Onboarding already completed");
  // }

  try {
    await updateUser(user.id, {
      type: user.type,
      // onboardingComplete: true,
    });

    return { success: true };
  } catch (error) {
    console.error("Error completing onboarding:", error);
    throw new Error("Failed to complete onboarding");
  }
}

export async function completeCompanyOnboarding(
  companyData: {
    companyName: string;
    location: string;
    about: string;
    website: string;
    logo?: string;
    xAccount?: string;
  },
  user: User
) {
  // const session = await auth();

  // if (!session?.user?.id) {
  //   throw new Error("Not authenticated");
  // }

  try {
    const companyId = await createCompany({
      name: companyData.companyName,
      location: companyData.location,
      about: companyData.about,
      website: companyData.website,
      logo: companyData.logo || "",
      xAccount: companyData.xAccount,
      userId: user.id,
    });

    await updateUser(user.id, {
      email: user.email!,
      username: user.username || companyData.companyName,
      profilePic: user.profilePic || undefined,
      type: "ORG",
      // companyId: companyId,
      // onboardingComplete: true,
    });

    return { success: true, companyId: companyId };
  } catch (error) {
    console.error("Error completing company onboarding:", error);
    throw new Error("Failed to complete company setup");
  }
}

export async function completeJobSeekerOnboarding(
  jobSeekerData: {
    name: string;
    about: string;
    resume?: string;
  },
  user: User
) {
  // const session = await auth();

  // if (!session?.user?.id) {
  //   throw new Error("Not authenticated");
  // }

  try {
    const jobSeekerId = await createJobSeeker({
      name: jobSeekerData.name,
      about: jobSeekerData.about,
      resume: jobSeekerData.resume || "",
      userId: user.id,
    });

    await updateUser(user.id, {
      email: user.email!,
      username: jobSeekerData.name,
      profilePic: user.profilePic,
      type: "USER",
      // jobSeekerId: jobSeekerId,
      // onboardingComplete: true,
    });

    return { success: true, jobSeekerId: jobSeekerId };
  } catch (error) {
    console.error("Error completing job seeker onboarding:", error);
    throw new Error("Failed to complete profile setup");
  }
}
