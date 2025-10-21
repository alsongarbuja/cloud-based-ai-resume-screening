import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { createUser, getUserByEmail, updateUser } from "../database/firestore"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, 
    updateAge: 24 * 60 * 60,
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, 
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      try {
        const existingUser = await getUserByEmail(user.email);
        let isNewUser = false;

        if (!existingUser) {
          // Create new user
          await createUser({
            name: user.name || "",
            email: user.email,
            image: user.image || "",
            onboardingComplete: false,
          });
          isNewUser = true;
        } else {
          // Update existing user data
          await updateUser(existingUser.id, {
            name: user.name || existingUser.name,
            image: user.image || existingUser.image,
          });
        }

        if (account && isNewUser) {
          (account as any).isNewUser = true;
        }

        return true;
      } catch (error) {
        console.error("Error during sign in:", error);
        return false;
      }
    },

    async jwt({ token, user, trigger, account }) {
      // Track if this is a newly created user
      if (account?.isNewUser) {
        token.isNewUser = true;
      }

      // Always refresh from Firestore if onboarding is not complete
      // This ensures we catch when a user just completed their onboarding
      const shouldRefresh =
        user ||
        trigger === "update" ||
        !token.id ||
        !token.hasOwnProperty('onboardingComplete') ||
        token.onboardingComplete === false;

      if (shouldRefresh) {
        const email = user?.email || token.email as string;
        if (email) {
          try {
            const firestoreUser = await getUserByEmail(email);
            if (firestoreUser) {
              token.id = firestoreUser.id;
              token.userType = firestoreUser.userType;
              token.onboardingComplete = firestoreUser.onboardingComplete ?? false;
              token.companyId = firestoreUser.companyId;
              token.jobSeekerId = firestoreUser.jobSeekerId;
              token.lastUpdated = Date.now();

              if (firestoreUser.createdAt) {
                const now = new Date();
                const createdAt = firestoreUser.createdAt instanceof Date
                  ? firestoreUser.createdAt
                  : new Date(firestoreUser.createdAt);
                const timeDiff = now.getTime() - createdAt.getTime();
                if (timeDiff < 30000) { 
                  token.isNewUser = true;
                } else {
                  token.isNewUser = false;
                }
              }

              if (firestoreUser.onboardingComplete) {
                token.isNewUser = false;
              }
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }
      }

      if (token.onboardingComplete === undefined) {
        token.onboardingComplete = false;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user = {
          ...session.user,
          id: token.id as string,
          userType: token.userType as "COMPANY" | "JOB_SEEKER" | undefined,
          onboardingComplete: token.onboardingComplete === true,
          companyId: token.companyId as string | undefined,
          jobSeekerId: token.jobSeekerId as string | undefined,
          isNewUser: token.isNewUser === true,
        };
      }
      return session;
    },

    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  debug: false,
});