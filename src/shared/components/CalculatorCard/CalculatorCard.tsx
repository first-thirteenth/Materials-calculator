import { type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import styles from "./CalculatorCard.module.css";

interface CalculatorCardProps {
  icon: ReactNode;
  iconBg?: string;
  title: string;
  description: string;
  onClick?: () => void;
}

export function CalculatorCard({
  icon,
  iconBg = "var(--color-primary)",
  title,
  description,
  onClick,
}: CalculatorCardProps) {
  return (
    <button className={styles.card} onClick={onClick}>
      <div className={styles.iconWrap} style={{ background: iconBg }}>
        {icon}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
      <ChevronRight className={styles.arrow} size={18} strokeWidth={2} />
    </button>
  );
}
