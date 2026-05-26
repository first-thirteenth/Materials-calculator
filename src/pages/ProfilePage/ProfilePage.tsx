import { useState } from "react";
import { ArrowLeft, UserCircle, Pencil, Check, X, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { useAuth } from "../../app/hooks/useAuth";
import styles from "./ProfilePage.module.css";

export function ProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [editing, setEditing] = useState(false);
  const [nameValue, setNameValue] = useState(user?.displayName ?? "");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  async function handleSaveName() {
    if (!user) return;
    setSaving(true);
    setSaveError("");
    try {
      await updateProfile(user, { displayName: nameValue.trim() || null });
      setEditing(false);
    } catch {
      setSaveError(t("profile.saveError"));
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setNameValue(user?.displayName ?? "");
    setSaveError("");
    setEditing(false);
  }

  const initials = (user?.displayName ?? user?.email ?? "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate("/")}
            aria-label={t("profile.back")}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className={styles.title}>{t("profile.title")}</h1>
        </div>
      </header>

      <main className={styles.main}>
        {/* Avatar */}
        <div className={styles.avatarSection}>
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName ?? ""}
              className={styles.avatarImg}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {initials.length > 0 ? (
                <span className={styles.initials}>{initials}</span>
              ) : (
                <UserCircle size={48} />
              )}
            </div>
          )}
        </div>

        {/* Info card */}
        <div className={styles.card}>
          {/* Display name row */}
          <div className={styles.row}>
            <span className={styles.label}>{t("profile.name")}</span>
            {editing ? (
              <div className={styles.editRow}>
                <input
                  className={styles.input}
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                  autoFocus
                  maxLength={60}
                  placeholder={t("profile.namePlaceholder")}
                />
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={handleSaveName}
                  disabled={saving}
                  aria-label={t("profile.save")}
                >
                  <Check size={16} />
                </button>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={handleCancel}
                  aria-label={t("profile.cancel")}
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className={styles.valueRow}>
                <span className={styles.value}>
                  {user?.displayName || (
                    <span className={styles.placeholder}>
                      {t("profile.namePlaceholder")}
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => setEditing(true)}
                  aria-label={t("profile.editName")}
                >
                  <Pencil size={15} />
                </button>
              </div>
            )}
          </div>
          {saveError && <p className={styles.error}>{saveError}</p>}

          <div className={styles.divider} />

          {/* Email row */}
          <div className={styles.row}>
            <span className={styles.label}>{t("profile.email")}</span>
            <span className={styles.value}>{user?.email ?? "—"}</span>
          </div>
        </div>

        {/* Sign out */}
        <button type="button" className={styles.signOutBtn} onClick={signOut}>
          <LogOut size={16} />
          {t("profile.signOut")}
        </button>
      </main>
    </div>
  );
}
