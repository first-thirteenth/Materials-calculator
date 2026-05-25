import { useEffect, useState, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth, getFirebaseAuthOrThrow } from "../firebase/firebase";
import { AuthContext } from "./AuthContextValue";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => Boolean(auth));

  useEffect(() => {
    if (!auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function signIn(email: string, password: string) {
    const { auth: safeAuth } = getFirebaseAuthOrThrow();
    await signInWithEmailAndPassword(safeAuth, email, password);
  }

  async function signUp(email: string, password: string, name: string) {
    const { auth: safeAuth } = getFirebaseAuthOrThrow();
    const { user } = await createUserWithEmailAndPassword(
      safeAuth,
      email,
      password,
    );
    await updateProfile(user, { displayName: name });
  }

  async function signInWithGoogle() {
    const { auth: safeAuth, googleProvider: safeGoogleProvider } =
      getFirebaseAuthOrThrow();

    try {
      await signInWithPopup(safeAuth, safeGoogleProvider);
    } catch (error) {
      const code =
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        typeof (error as { code: unknown }).code === "string"
          ? (error as { code: string }).code
          : "";

      if (code === "auth/popup-blocked") {
        await signInWithRedirect(safeAuth, safeGoogleProvider);
        return;
      }

      throw error;
    }
  }

  async function signOut() {
    const { auth: safeAuth } = getFirebaseAuthOrThrow();
    await firebaseSignOut(safeAuth);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
