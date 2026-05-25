import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "../../../app/hooks/useAuth";
import { getAuthErrorMessage } from "../../../shared/utils/getAuthErrorMessage";
import { FirebaseAuthDiagnostics } from "../../../shared/components/FirebaseAuthDiagnostics/FirebaseAuthDiagnostics";
import styles from "./LoginPage.module.css";

export function LoginPage() {
  const { t } = useTranslation();
  const {
    user,
    signIn,
    signInWithGoogle,
    isGoogleSignInEnabled,
    redirectAuthError,
    clearRedirectAuthError,
  } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const redirectErrorMessage = redirectAuthError
    ? getAuthErrorMessage(redirectAuthError, t)
    : "";
  const displayedError = error || redirectErrorMessage;

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearRedirectAuthError();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/");
    } catch (error) {
      setError(getAuthErrorMessage(error, t));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    clearRedirectAuthError();
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (error) {
      console.error("[Auth][Google][LoginPage]", error);
      setError(getAuthErrorMessage(error, t));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t("auth.loginTitle")}</h1>
        <p className={styles.subtitle}>{t("auth.loginSubtitle")}</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <Mail size={16} className={styles.fieldIcon} />
            <input
              className={styles.input}
              type="email"
              placeholder={t("auth.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <Lock size={16} className={styles.fieldIcon} />
            <input
              className={styles.input}
              type="password"
              placeholder={t("auth.password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {displayedError && <p className={styles.error}>{displayedError}</p>}

          <button
            className={styles.btnPrimary}
            type="submit"
            disabled={loading}
          >
            {loading ? t("auth.loading") : t("auth.loginBtn")}
          </button>
        </form>

        <div className={styles.divider}>
          <span>{t("auth.or")}</span>
        </div>

        <button
          className={styles.btnGoogle}
          onClick={handleGoogle}
          type="button"
          disabled={loading}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path
              fill="#FFC107"
              d="M43.6 20H24v8h11.3C33.7 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.4-4z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-2.9-11.2-7.1l-6.6 5.1C9.8 39.8 16.4 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.2 5.2C41.3 35.5 44 30.1 44 24c0-1.3-.1-2.7-.4-4z"
            />
          </svg>
          {t("auth.googleBtn")}
        </button>
        <p className={styles.redirectHint}>
          {isGoogleSignInEnabled
            ? t("auth.googleRedirectHint")
            : t("auth.googleDisabledHint")}
        </p>
        <FirebaseAuthDiagnostics />

        <p className={styles.footer}>
          {t("auth.noAccount")}{" "}
          <Link to="/register" className={styles.link}>
            {t("auth.registerLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
