import { useEffect, useState, type ReactNode } from "react";
import {
  getRedirectResult,
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
import { logAuthDebug } from "../../shared/utils/logAuthDebug";

let redirectResultPromise: Promise<User | null> | null = null;
const redirectPendingKey = "mc:googleRedirectPending";
const popupTimeoutMs = 12000;

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

function isAuthDebugEnabled() {
  if (import.meta.env.DEV) {
    return true;
  }

  const params = new URLSearchParams(window.location.search);
  return params.get("debugAuth") === "1";
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

function shouldFallbackToRedirect(error: unknown) {
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

    if (isAuthDebugEnabled()) {
      console.info("[Auth][Debug] AuthProvider mounted", {
        href: window.location.href,
      });
    }

    void getRedirectResultOnce()
      .then((resultUser) => {
        const hadRedirectAttempt =
          window.sessionStorage.getItem(redirectPendingKey) === "1";

        if (isAuthDebugEnabled()) {
          console.info("[Auth][Debug] RedirectResult resolved", {
            hasUser: Boolean(resultUser),
            hadRedirectAttempt,
            href: window.location.href,
          });
        }

        if (resultUser) {
          window.sessionStorage.removeItem(redirectPendingKey);
          setUser(resultUser);
        } else if (hadRedirectAttempt) {
          window.sessionStorage.removeItem(redirectPendingKey);
          setRedirectAuthError({ code: "auth/redirect-result-missing" });
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
      if (isAuthDebugEnabled()) {
        console.info("[Auth][Debug] onAuthStateChanged", {
          hasUser: Boolean(firebaseUser),
          uid: firebaseUser?.uid ?? null,
          href: window.location.href,
        });
      }

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
    window.sessionStorage.removeItem(redirectPendingKey);

    try {
      await Promise.race([
        signInWithPopup(safeAuth, safeGoogleProvider),
        new Promise<never>((_, reject) => {
          window.setTimeout(
            () => reject(new Error("popup-timeout")),
            popupTimeoutMs,
          );
        }),
      ]);
    } catch (error) {
      logAuthDebug("PopupSignIn", error);

      if (isGoogleProviderDisabledError(error)) {
        setIsGoogleSignInEnabled(false);
      }

      if (shouldFallbackToRedirect(error)) {
        window.sessionStorage.setItem(redirectPendingKey, "1");
        await signInWithRedirect(safeAuth, safeGoogleProvider);
        return;
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
