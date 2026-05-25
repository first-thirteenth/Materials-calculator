import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import styles from "./LangSwitcher.module.css";

const LANGS = [
  { code: "ru", fi: "ru", label: "Русский" },
  { code: "en", fi: "gb", label: "English" },
  { code: "pl", fi: "pl", label: "Polski" },
  { code: "uk", fi: "ua", label: "Українська" },
];

export function LangSwitcher() {
  const { i18n } = useTranslation();
  const current =
    LANGS.find((l) => l.code === i18n.language?.slice(0, 2)) ?? LANGS[0];
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function select(code: string) {
    i18n.changeLanguage(code);
    setOpen(false);
  }

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`fi fi-${current.fi} ${styles.flag}`} />
        <span className={styles.code}>{current.code.toUpperCase()}</span>
        <ChevronDown
          size={12}
          className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
        />
      </button>

      {open && (
        <ul className={styles.dropdown} role="listbox">
          {LANGS.map((lang) => (
            <li
              key={lang.code}
              role="option"
              aria-selected={lang.code === current.code}
              className={`${styles.option} ${lang.code === current.code ? styles.optionActive : ""}`}
              onClick={() => select(lang.code)}
            >
              <span className={`fi fi-${lang.fi} ${styles.flagItem}`} />
              <span className={styles.optionLabel}>{lang.label}</span>
              {lang.code === current.code && (
                <span className={styles.check}>✓</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
