import { useId } from "react";
import styles from "./admin.module.css";

type BaseProps = {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
};

type InputProps = BaseProps & { as?: "input" } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name">;
type TextareaProps = BaseProps & { as: "textarea" } & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name">;
type SelectProps = BaseProps & { as: "select" } & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "name">;

/** Champ de formulaire admin : libellé, aide, message d'erreur reliés au contrôle. */
export function Field(props: InputProps | TextareaProps | SelectProps) {
  const autoId = useId();
  const { label, name, error, hint, optional, className, ...rest } = props;
  const id = rest.id ?? autoId;
  const describedBy = [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(" ") || undefined;
  const common = {
    id,
    name,
    className: styles.input,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
  };

  let control: React.ReactNode;
  if (rest.as === "textarea") {
    const { as: _as, ...textareaProps } = rest;
    void _as;
    control = <textarea rows={4} {...textareaProps} {...common} />;
  } else if (rest.as === "select") {
    const { as: _as, ...selectProps } = rest;
    void _as;
    control = <select {...selectProps} {...common} />;
  } else {
    const { as: _as, ...inputProps } = rest;
    void _as;
    control = <input type="text" {...inputProps} {...common} />;
  }

  return (
    <div className={[styles.field, className].filter(Boolean).join(" ")}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {optional && <span className={styles.optional}> (facultatif)</span>}
      </label>
      {control}
      {hint && (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}

/** Case à cocher avec libellé et explication. */
export function Checkbox({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className={styles.checkbox}>
      <input type="checkbox" name={name} defaultChecked={defaultChecked} />
      <span className={styles.checkboxText}>
        <span className={styles.label}>{label}</span>
        {hint && <span className={styles.hint}>{hint}</span>}
      </span>
    </label>
  );
}
