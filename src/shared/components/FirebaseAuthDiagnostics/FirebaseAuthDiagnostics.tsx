import styles from "./FirebaseAuthDiagnostics.module.css";
import { getFirebaseAuthDiagnostics } from "../../../app/firebase/firebase";

function isLocalHostName(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export function FirebaseAuthDiagnostics() {
  const diagnostics = getFirebaseAuthDiagnostics();
  const params = new URLSearchParams(window.location.search);
  const isDebugEnabled = import.meta.env.DEV || params.get("debugAuth") === "1";

  if (!isDebugEnabled) {
    return null;
  }

  const currentOrigin = window.location.origin;
  const runningOnLocal = isLocalHostName(window.location.hostname);
  const hasProdLocalhostMismatch =
    diagnostics.isProdBuild &&
    diagnostics.isAuthDomainLocalhost &&
    !runningOnLocal;

  return (
    <details className={styles.wrapper}>
      <summary className={styles.summary}>Firebase Auth diagnostics</summary>
      <div className={styles.content}>
        <div className={styles.row}>
          <span className={styles.label}>build mode</span>
          <span className={styles.value}>
            {diagnostics.isProdBuild ? "production" : "development"}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>app origin</span>
          <span className={styles.value}>{currentOrigin}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>projectId</span>
          <span className={styles.value}>
            {diagnostics.projectId || "(empty)"}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>authDomain</span>
          <span className={styles.value}>
            {diagnostics.authDomain || "(empty)"}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>config status</span>
          <span className={styles.value}>
            {diagnostics.isFirebaseConfigured ? "valid" : "invalid"}
          </span>
        </div>

        {hasProdLocalhostMismatch ? (
          <p className={styles.warn}>
            Mismatch detected: production app is trying to auth via localhost.
            Check VITE_FIREBASE_AUTH_DOMAIN in CI/CD build variables.
          </p>
        ) : (
          <p className={styles.ok}>
            No obvious authDomain mismatch detected on this page.
          </p>
        )}
      </div>
    </details>
  );
}
