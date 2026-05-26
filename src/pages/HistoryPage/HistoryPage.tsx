import { useEffect, useState } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/hooks/useAuth";
import {
  listCalculations,
  deleteCalculation,
} from "../../features/history/services/historyService";
import type { CalculationRecord } from "../../features/history/types/calculation";
import styles from "./HistoryPage.module.css";

export function HistoryPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [records, setRecords] = useState<CalculationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    listCalculations(user.uid)
      .then(setRecords)
      .finally(() => setLoading(false));
  }, [user]);

  async function handleDelete(id: string) {
    if (!user) return;
    await deleteCalculation(user.uid, id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }

  const fmt = new Intl.NumberFormat(i18n.language, {
    maximumFractionDigits: 2,
  });
  const fmtInt = new Intl.NumberFormat(i18n.language, {
    maximumFractionDigits: 0,
  });

  function formatDate(record: CalculationRecord) {
    if (!record.createdAt) return "";
    const ts = record.createdAt;
    const ms =
      typeof ts.toMillis === "function" ? ts.toMillis() : Number(ts) * 1000;
    return new Intl.DateTimeFormat(i18n.language, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(ms));
  }

  function renderResult(record: CalculationRecord) {
    if (record.type === "brick") {
      return (
        <>
          <span>
            {fmtInt.format(record.result.bricksWithWaste)} —{" "}
            {t("history.brick.bricksWithWaste")}
          </span>
          <span>
            {fmtInt.format(record.result.bricksWithoutWaste)} —{" "}
            {t("history.brick.bricksWithoutWaste")}
          </span>
          <span>
            {fmt.format(record.result.bricksPerSquareMeter)} —{" "}
            {t("history.brick.bricksPerM2")}
          </span>
        </>
      );
    }
    if (record.type === "paint") {
      return (
        <>
          <span>
            {fmt.format(record.result.litersWithWaste)} л —{" "}
            {t("history.paint.litersWithWaste")}
          </span>
          <span>
            {fmt.format(record.result.litersWithoutWaste)} л —{" "}
            {t("history.paint.litersWithoutWaste")}
          </span>
          <span>
            {fmt.format(record.result.litersPerCoat)} л —{" "}
            {t("history.paint.litersPerCoat")}
          </span>
        </>
      );
    }
    if (record.type === "concrete") {
      return (
        <>
          <span>
            {fmt.format(record.result.volumeWithWasteM3)} м³ —{" "}
            {t("history.concrete.volumeWithWaste")}
          </span>
          <span>
            {fmt.format(record.result.volumeM3)} м³ —{" "}
            {t("history.concrete.volumeWithoutWaste")}
          </span>
          <span>
            {fmtInt.format(record.result.bags50kg)} —{" "}
            {t("history.concrete.bags50kg")}
          </span>
        </>
      );
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate("/")}
            aria-label={t("history.title")}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className={styles.title}>{t("history.title")}</h1>
        </div>
      </header>

      <main className={styles.main}>
        {loading ? (
          <p className={styles.empty}>{t("auth.loading")}</p>
        ) : records.length === 0 ? (
          <p className={styles.empty}>{t("history.empty")}</p>
        ) : (
          <ul className={styles.list}>
            {records.map((record) => (
              <li key={record.id} className={styles.item}>
                <div className={styles.itemHeader}>
                  <span className={styles.badge}>
                    {t(`history.types.${record.type}`)}
                  </span>
                  <span className={styles.date}>{formatDate(record)}</span>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(record.id)}
                    aria-label={t("history.delete")}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className={styles.results}>{renderResult(record)}</div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
