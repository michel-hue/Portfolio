import type { ElementType } from "react";
import styles from "./Eyebrow.module.css";

type EyebrowProps = {
  /** « 02 », « A »… affiché en accent. */
  index?: string;
  children?: React.ReactNode;
  as?: ElementType;
  className?: string;
};

/** Sur-titre en Geist Mono capitales : « 02 — Projets ». */
export function Eyebrow({ index, children, as: Tag = "p", className }: EyebrowProps) {
  return (
    <Tag className={[styles.eyebrow, className].filter(Boolean).join(" ")}>
      {index && <span className={styles.index}>{index}</span>}
      {index && children ? " — " : null}
      {children}
    </Tag>
  );
}
