import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  connectFirestoreEmulator,
  initializeFirestore,
  persistentLocalCache,
  type Firestore
} from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { CACHE } from "@/config/constants";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

let db: Firestore;

const useEmulators = process.env.NODE_ENV === 'development' &&
                     process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true' &&
                     typeof window !== 'undefined';

try {
  if (useEmulators) {
    db = initializeFirestore(app, {
      experimentalForceLongPolling: false,
      cacheSizeBytes: CACHE.FIRESTORE_SIZE_BYTES,
      ignoreUndefinedProperties: true,
    });

    connectFirestoreEmulator(db, 'localhost', 8080);
  } else {
    db = initializeFirestore(app, {
      experimentalForceLongPolling: false,
      cacheSizeBytes: CACHE.FIRESTORE_SIZE_BYTES,
      ignoreUndefinedProperties: true,
      localCache: persistentLocalCache({
        cacheSizeBytes: CACHE.FIRESTORE_SIZE_BYTES,
      }),
    });
  }
} catch {
  db = getFirestore(app);
}

export const auth = getAuth(app);

if (useEmulators) {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  } catch {
  }
}

export { db };
export default app;