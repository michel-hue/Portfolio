import Link from "next/link";
import type { IconComponent } from "./icons";
import styles from "./Button.module.css";

type Variant =
  /** Fond accent (« Voir les projets », « Écrire un message »). */
  | "primary"
  /** Contour line-strong (« Me contacter », « Voir le projet »). */
  | "outline"
  /** Contour accent (« Ouvrir l'app »). */
  | "outline-accent"
  /** Lien texte couleur encre (« Télécharger le CV »). */
  | "text"
  /** Lien texte accent (« En savoir plus sur moi »). */
  | "link";

type CommonProps = {
  children: React.ReactNode;
  variant?: Variant;
  /** sm = 16px de marge interne (cartes), md = 18px, lg = 20px. */
  size?: "sm" | "md" | "lg";
  iconStart?: IconComponent;
  iconEnd?: IconComponent;
  className?: string;
};

type LinkProps = CommonProps & {
  href: string;
  /** Ouvre dans un nouvel onglet. Par défaut : vrai pour les URL http(s). */
  external?: boolean;
  download?: boolean;
  "aria-current"?: "page";
};

type ButtonProps = CommonProps & {
  href?: undefined;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
};

export function Button(props: LinkProps | ButtonProps) {
  const {
    children,
    variant = "outline",
    size = "md",
    iconStart: IconStart,
    iconEnd: IconEnd,
    className,
  } = props;

  const classes = [styles.button, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {IconStart && <IconStart size={16} strokeWidth={1.75} aria-hidden="true" />}
      {children}
      {IconEnd && (
        <IconEnd size={16} strokeWidth={1.75} aria-hidden="true" className={styles.iconEnd} />
      )}
    </>
  );

  if (props.href === undefined) {
    return (
      <button
        type={props.type ?? "button"}
        onClick={props.onClick}
        disabled={props.disabled}
        className={classes}
      >
        {content}
      </button>
    );
  }

  const { href, download } = props;
  const isHttp = /^https?:\/\//.test(href);
  const external = props.external ?? isHttp;

  if (isHttp || href.startsWith("mailto:") || download) {
    return (
      <a
        href={href}
        className={classes}
        download={download || undefined}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
        {external && <span className="visually-hidden"> (nouvel onglet)</span>}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} aria-current={props["aria-current"]}>
      {content}
    </Link>
  );
}
