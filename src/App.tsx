import { Layers, Paintbrush, Package } from "lucide-react";
import { useTheme } from "./app/hooks/useTheme";
import { ThemeToggle } from "./shared/components/ThemeToggle/ThemeToggle";
import { CalculatorCard } from "./shared/components/CalculatorCard/CalculatorCard";
import styles from "./App.module.css";

const calculators = [
  {
    icon: <Layers size={22} />,
    iconBg: "var(--icon-orange)",
    title: "Кирпич",
    description: "Количество кирпичей по площади стен",
  },
  {
    icon: <Paintbrush size={22} />,
    iconBg: "var(--icon-blue)",
    title: "Краска",
    description: "Литры краски для стен и потолков",
  },
  {
    icon: <Package size={22} />,
    iconBg: "var(--icon-gray)",
    title: "Бетон",
    description: "Объём бетона для фундамента или стяжки",
  },
];

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.logo}>Калькулятор материалов</span>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>Рассчитайте материалы</h1>
          <p className={styles.heroSubtitle}>
            Точный расчёт строительных материалов без лишних формул
          </p>
        </section>

        <p className={styles.sectionLabel}>Калькуляторы</p>
        <div className={styles.group}>
          {calculators.map((calc) => (
            <CalculatorCard
              key={calc.title}
              icon={calc.icon}
              iconBg={calc.iconBg}
              title={calc.title}
              description={calc.description}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
