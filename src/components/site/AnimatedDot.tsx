import styles from "./AnimatedDot.module.css";

/** Point final des titres : apparaît en dernier (échelle 0 → 1,25 → 1). */
export function AnimatedDot({ char = "." }: { char?: string }) {
  return (
    <span className={styles.dot} aria-hidden="true">
      {char}
    </span>
  );
}
