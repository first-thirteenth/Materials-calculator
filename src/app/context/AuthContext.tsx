import { useEffect, useState, type ReactNode } from "react";
import {
  getRedirectResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth, getFirebaseAuthOrThrow } from "../firebase/firebase";
import { AuthContext } from "./AuthContextValue";
import { logAuthDebug } from "../../shared/utils/logAuthDebug";

let redirectResultPromise: Promise<User | null> | null = null;

function getRedirectResultOnce() {
  if (!redirectResultPromise) {
    if (!auth) {
      redirectResultPromise = Promise.resolve(null);
    } else {
      redirectResultPromise = getRedirectResult(auth).then(
        (result) => result?.user ?? null,
      );
    }
  }

  return redirectResultPromise;
}

function getAuthErrorCode(error: unknown) {
  return typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
    ? (error as { code: string }).code
    : "";
}

function isGoogleProviderDisabledError(error: unknown) {
  const code = getAuthErrorCode(error);
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  return (
    code === "auth/operation-not-allowed" ||
    code === "auth/configuration-not-found" ||
    message.includes("resource-not-found")
  );
}

function isPopupIssue(error: unknown) {
  const code = getAuthErrorCode(error);
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  return (
    code === "auth/popup-blocked" ||
    code === "auth/cancelled-popup-request" ||
    code === "auth/internal-error" ||
    message.includes("popup-timeout") ||
    message.includes("unexpected number in json")
  );
}

function clearCorruptedFirebaseAuthStorage() {
  const stores = [window.sessionStorage, window.localStorage];

  for (const store of stores) {
    const keys = Object.keys(store);

    for (const key of keys) {
      const isFirebaseAuthEventKey =
        key.includes("firebase:authEvent") ||
        key.includes("firebase:pendingRedirect");

      if (!isFirebaseAuthEventKey) {
        continue;
      }

      const rawValue = store.getItem(key);
      if (!rawValue) {
        continue;
      }

      try {
        JSON.parse(rawValue);
      } catch {
        store.removeItem(key);
      }
    }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => Boolean(auth));
  const [isGoogleSignInEnabled, setIsGoogleSignInEnabled] = useState(true);
  const [redirectAuthError, setRedirectAuthError] = useState<unknown | null>(
    null,
  );

  useEffect(() => {
    if (!auth) {
      return;
    }

    void getRedirectResultOnce()
      .then((resultUser) => {
        if (resultUser) {
          setUser(resultUser);
        }
      })
      .catch((error: unknown) => {
        console.error("[Auth][Google][RedirectResult]", error);
        logAuthDebug("RedirectResult", error);

        if (isGoogleProviderDisabledError(error)) {
          setIsGoogleSignInEnabled(false);
        }

        const message =
          error instanceof Error ? error.message.toLowerCase() : "";
        if (message.includes("unexpected number in json")) {
          clearCorruptedFirebaseAuthStorage();
        }

        setRedirectAuthError(error);
      });

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    function handleWindowFocus() {
      // Firebase settings may be changed in another tab; allow immediate retry.
      setIsGoogleSignInEnabled(true);
    }

    window.addEventListener("focus", handleWindowFocus);
    return () => {
      window.removeEventListener("focus", handleWindowFocus);
    };
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

    // Force account chooser so users always see an explicit Google step.
    safeGoogleProvider.setCustomParameters({ prompt: "select_account" });

    // Allow instant retry after console-side fixes without forcing page reload.
    if (!isGoogleSignInEnabled) {
      setIsGoogleSignInEnabled(true);
    }

    setRedirectAuthError(null);

    try {
      await signInWithPopup(safeAuth, safeGoogleProvider);
    } catch (error) {
      logAuthDebug("PopupSignIn", error);

      if (isGoogleProviderDisabledError(error)) {
        setIsGoogleSignInEnabled(false);
      }

      if (isPopupIssue(error)) {
        // Keep the original popup error visible to user instead of silently
        // falling back to redirect flow, which can be blocked by browser policy.
        setRedirectAuthError(error);
      }

      throw error;
    }
  }

  function clearRedirectAuthError() {
    setRedirectAuthError(null);
  }

  async function signOut() {
    const { auth: safeAuth } = getFirebaseAuthOrThrow();
    await firebaseSignOut(safeAuth);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isGoogleSignInEnabled,
        redirectAuthError,
        clearRedirectAuthError,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
