import {
  Layers,
  Paintbrush,
  Package,
  LogOut,
  UserCircle,
  History,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../app/hooks/useTheme";
import { useAuth } from "../../app/hooks/useAuth";
import { ThemeToggle } from "../../shared/components/ThemeToggle/ThemeToggle";
import { CalculatorCard } from "../../shared/components/CalculatorCard/CalculatorCard";
import { LangSwitcher } from "../../shared/components/LangSwitcher/LangSwitcher";
import styles from "./HomePage.module.css";

const CALCULATOR_KEYS = [
  {
    key: "brick",
    icon: <Layers size={22} />,
    iconBg: "var(--icon-orange)",
    path: "/brick",
  },
  {
    key: "paint",
    icon: <Paintbrush size={22} />,
    iconBg: "var(--icon-blue)",
    path: "/paint",
  },
  {
    key: "concrete",
    icon: <Package size={22} />,
    iconBg: "var(--icon-gray)",
    path: "/concrete",
  },
];

export function HomePage() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.logo}>{t("header.title")}</span>
          <div className={styles.headerActions}>
            <LangSwitcher />
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <button
              className={styles.historyBtn}
              onClick={() => navigate("/history")}
              aria-label={t("history.title")}
              title={t("history.title")}
            >
              <History size={20} />
            </button>
            <div className={styles.userMenu}>
              <button
                className={styles.avatarBtn}
                onClick={() => navigate("/profile")}
                aria-label={t("profile.title")}
                title={t("profile.title")}
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName ?? ""}
                    className={styles.avatar}
                  />
                ) : (
                  <UserCircle size={22} className={styles.avatarIcon} />
                )}
              </button>
              <button
                className={styles.signOutBtn}
                onClick={signOut}
                aria-label="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>{t("hero.title")}</h1>
          <p className={styles.heroSubtitle}>{t("hero.subtitle")}</p>
        </section>

        <p className={styles.sectionLabel}>{t("calculators.label")}</p>
        <div className={styles.group}>
          {CALCULATOR_KEYS.map((calc) => (
            <CalculatorCard
              key={calc.key}
              icon={calc.icon}
              iconBg={calc.iconBg}
              title={t(`calculators.${calc.key}.title`)}
              description={t(`calculators.${calc.key}.description`)}
              onClick={calc.path ? () => navigate(calc.path) : undefined}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
