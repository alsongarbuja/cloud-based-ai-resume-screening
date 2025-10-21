import "server-only";
import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const apps = getApps();

const hasAdminCredentials =
  process.env.FIREBASE_ADMIN_PROJECT_ID &&
  process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
  process.env.FIREBASE_ADMIN_PRIVATE_KEY;

let adminDb: FirebaseFirestore.Firestore | null = null;

if (hasAdminCredentials) {
  const app =
    apps.length === 0
      ? initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
          } as ServiceAccount),
        })
      : apps[0];

  adminDb = getFirestore(app);

  adminDb.settings({
    ignoreUndefinedProperties: true,
  });
}

export { adminDb };
export const isAdminSdkAvailable = !!adminDb;
