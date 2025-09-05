import React from "react";
import { Link } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa";
import type { Round } from "../types";
import styles from "../assets/css/RoundList.module.css";

type Props = { rounds: Round[]; onDelete?: (id: number) => void };

const RoundList: React.FC<Props> = ({ rounds, onDelete }) => {
  return (
    <div className={styles.wrap}>
      {rounds.map(r => {
        // Parse itinerary -> steps[]
        let steps: string[] = [];
        if (r.itinerary) {
          try {
            const parsed =
              typeof r.itinerary === "string"
                ? JSON.parse(r.itinerary)
                : r.itinerary;
            steps = Array.isArray(parsed?.steps) ? parsed.steps : [];
          } catch {
            steps = [];
          }
        }

        return (
          <article key={r.id} className={styles.card}>
            <header className={styles.cardHeader}>
              <h3 className={styles.title}>Tournée #{r.id}</h3>
              <div className={styles.titleRow}>
                {r.date && <span className={styles.tag}>{r.date}</span>}
              </div>
              <div className={styles.meta}>
                <span className={styles.badge}>
                  {steps.length} étape{steps.length > 1 ? "s" : ""}
                </span>
                {/* {r.type_optimisation && (
                  <span className={styles.badgeMuted}>{r.type_optimisation}</span>
                )} */}
              </div>
            </header>

            {steps.length > 0 && (
              <ul className={styles.steps}>
                {steps.map((step, i) => (
                  <li key={i} className={styles.step}>
                    <span className={styles.stepIndex}>{i + 1}</span>
                    <span className={styles.stepText}>{step}</span>
                  </li>
                ))}
              </ul>
            )}

            <footer className={styles.actions}>
              <Link
                to={`/round/${r.id}/optimize`}
                className={`${styles.neuBtn} ${styles.primary}`}
              >
                Voir sur la carte
              </Link>
              <FaRegTrashAlt 
                type="button"
                className={`${styles.neuBtn} ${styles.iconBtn} ${styles.danger}`}
                title="Supprimer la tournée"
                aria-label={`Supprimer la tournée ${r.id}`}
                onClick={() => onDelete && onDelete(r.id)}
              />
            </footer>
          </article>
        );
      })}
    </div>
  );
};

export default RoundList;
