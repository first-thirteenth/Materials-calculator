import { initializeApp, type FirebaseOptions } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

function isPlaceholderValue(value: string) {
  const normalized = value.trim().toLowerCase();

  return (
    normalized.startsWith("your_") ||
    normalized.includes("your_project") ||
    normalized === "your" ||
    normalized === "your-api-key" ||
    normalized === "your_api_key"
  );
}

function hasValidConfig(config: Record<string, unknown>) {
  return Object.values(config).every(
    (value) =>
      typeof value === "string" &&
      value.trim().length > 0 &&
      !isPlaceholderValue(value),
  );
}

export const isFirebaseConfigured = hasValidConfig(firebaseConfig);

const app = isFirebaseConfigured
  ? initializeApp(firebaseConfig as FirebaseOptions)
  : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const googleProvider = app ? new GoogleAuthProvider() : null;

export function getFirebaseAuthOrThrow() {
  if (!auth || !googleProvider) {
    throw new Error(
      "Firebase auth is not configured. Add VITE_FIREBASE_* values to .env.local and restart Vite.",
    );
  }

  return { auth, googleProvider };
}
