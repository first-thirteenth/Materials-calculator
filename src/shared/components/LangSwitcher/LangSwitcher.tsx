import { useTranslation } from "react-i18next";
import styles from "./LangSwitcher.module.css";

const LANGS = [
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
  { code: "pl", label: "PL" },
  { code: "uk", label: "UK" },
];

export function LangSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language?.slice(0, 2);

  return (
    <div className={styles.wrap}>
      {LANGS.map((lang) => (
        <button
          key={lang.code}
          className={`${styles.btn} ${current === lang.code ? styles.active : ""}`}
          onClick={() => i18n.changeLanguage(lang.code)}
          aria-label={lang.label}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
