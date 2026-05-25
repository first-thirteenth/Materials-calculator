import { useTheme } from './app/hooks/useTheme';
import { ThemeToggle } from './shared/components/ThemeToggle/ThemeToggle';
import styles from './App.module.css';

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
        <h1 className={styles.title}>Выберите калькулятор</h1>
        <p className={styles.subtitle}>Рассчитайте необходимое количество строительных материалов</p>
      </main>
    </div>
  );
}

export default App;
