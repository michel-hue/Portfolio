import styles from "./Tag.module.css";

type TagProps = {
  children: React.ReactNode;
  /**
   * filled   : fond surface (dans une carte)
   * outlined : fond surface-raised + filet (sur une section `surface`)
   * accent   : étiquette mise en avant
   */
  variant?: "filled" | "outlined" | "accent";
  className?: string;
};

/** Étiquette techno / badge en Geist Mono. */
export function Tag({ children, variant = "filled", className }: TagProps) {
  return (
    <span className={[styles.tag, styles[variant], className].filter(Boolean).join(" ")}>
      {children}
    </span>
  );
}

/** Liste d'étiquettes. */
export function TagList({
  items,
  variant,
  className,
  label,
}: {
  items: string[];
  variant?: TagProps["variant"];
  className?: string;
  label?: string;
}) {
  if (items.length === 0) return null;
  return (
    <ul className={[styles.list, className].filter(Boolean).join(" ")} aria-label={label}>
      {items.map((item) => (
        <li key={item}>
          <Tag variant={variant}>{item}</Tag>
        </li>
      ))}
    </ul>
  );
}
