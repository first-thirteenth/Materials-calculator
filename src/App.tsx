import { Layers, Paintbrush, Package } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "./app/hooks/useTheme";
import { ThemeToggle } from "./shared/components/ThemeToggle/ThemeToggle";
import { CalculatorCard } from "./shared/components/CalculatorCard/CalculatorCard";
import { LangSwitcher } from "./shared/components/LangSwitcher/LangSwitcher";
import styles from "./App.module.css";

const CALCULATOR_KEYS = [
  { key: "brick", icon: <Layers size={22} />, iconBg: "var(--icon-orange)" },
  { key: "paint", icon: <Paintbrush size={22} />, iconBg: "var(--icon-blue)" },
  { key: "concrete", icon: <Package size={22} />, iconBg: "var(--icon-gray)" },
];

function App() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.logo}>{t("header.title")}</span>
          <div className={styles.headerActions}>
            <LangSwitcher />
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
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
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
