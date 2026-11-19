"use client";

import { useId, useRef, useState, useTransition } from "react";
import { ArrowRight, Check } from "lucide-react";
import { sendContactMessage } from "@/actions/contact";
import { MESSAGE_TOPICS, type MessageTopic } from "@/lib/constants";
import {
  CONTACT_ERRORS,
  CONTACT_LIMITS,
  contactClientErrors,
  type ContactField,
} from "@/lib/validation";
import { Button } from "./Button";
import styles from "./ContactForm.module.css";

type Fields = Record<ContactField, string>;
const EMPTY: Fields = { name: "", email: "", message: "" };
const DEFAULT_TOPIC: MessageTopic = "Projet web";

/**
 * Formulaire de contact (maquette Contact.dc.html).
 * Validation immédiate côté client, puis envoi par Server Action
 * (Zod, pot de miel, 5 messages max par heure et par IP, enregistrement en base).
 */
export function ContactForm({ responseTime, email }: { responseTime: string; email: string }) {
  const id = useId();
  const [topic, setTopic] = useState<MessageTopic>(DEFAULT_TOPIC);
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [tried, setTried] = useState(false);
  const [serverInvalid, setServerInvalid] = useState<Partial<Record<ContactField, boolean>>>({});
  const [failure, setFailure] = useState<"rate_limited" | "error" | null>(null);
  const [sent, setSent] = useState<{ firstName: string; email: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const clientErrors = contactClientErrors(fields);
  const show: Record<ContactField, boolean> = {
    name: tried && (clientErrors.name || !!serverInvalid.name),
    email: tried && (clientErrors.email || !!serverInvalid.email),
    message: tried && (clientErrors.message || !!serverInvalid.message),
  };

  function update(key: ContactField) {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setFields((current) => ({ ...current, [key]: value }));
      setServerInvalid((current) => ({ ...current, [key]: false }));
    };
  }

  function focusFirst(invalid: Partial<Record<ContactField, boolean>>) {
    const first = (["name", "email", "message"] as const).find((key) => invalid[key]);
    const targets = { name: nameRef, email: emailRef, message: messageRef };
    if (first) targets[first].current?.focus();
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    if (clientErrors.name || clientErrors.email || clientErrors.message) {
      setTried(true);
      focusFirst(clientErrors);
      return;
    }

    const formData = new FormData(event.currentTarget);
    formData.set("topic", topic);
    setFailure(null);

    startTransition(async () => {
      try {
        const result = await sendContactMessage(formData);
        if (result.status === "success") {
          setSent({ firstName: result.firstName, email: result.email });
        } else if (result.status === "invalid") {
          const invalid = Object.fromEntries(result.fields.map((f) => [f, true]));
          setTried(true);
          setServerInvalid(invalid);
          focusFirst(invalid);
        } else {
          setFailure(result.status);
        }
      } catch {
        setFailure("error");
      }
    });
  }

  function reset() {
    setFields(EMPTY);
    setTopic(DEFAULT_TOPIC);
    setTried(false);
    setServerInvalid({});
    setFailure(null);
    setSent(null);
  }

  if (sent) {
    return (
      <div className={styles.success} role="status">
        <div className={styles.successIcon} aria-hidden="true">
          <Check size={28} strokeWidth={1.75} />
        </div>
        <h2 className="h2">Message envoyé.</h2>
        <p className="muted">
          Merci {sent.firstName}. Je te réponds sous {responseTime} à {sent.email}.
        </p>
        <div className={styles.successActions}>
          <Button href="/projets" variant="outline">
            Voir les projets
          </Button>
          <Button variant="outline" onClick={reset} className={styles.secondary}>
            Écrire un autre message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={styles.form} aria-busy={pending}>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>C’est pour…</legend>
        <div className={styles.chips}>
          {MESSAGE_TOPICS.map((option) => (
            <button
              key={option}
              type="button"
              className={styles.chip}
              aria-pressed={topic === option}
              onClick={() => setTopic(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      <div className={styles.field}>
        <label htmlFor={`${id}-nom`} className={styles.label}>
          Nom
        </label>
        <input
          ref={nameRef}
          id={`${id}-nom`}
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Ton nom"
          maxLength={CONTACT_LIMITS.nameMax}
          value={fields.name}
          onChange={update("name")}
          aria-invalid={show.name}
          aria-describedby={show.name ? `${id}-nom-err` : undefined}
          className={styles.input}
        />
        {show.name && (
          <p id={`${id}-nom-err`} className={styles.error}>
            {CONTACT_ERRORS.name}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor={`${id}-mail`} className={styles.label}>
          Email
        </label>
        <input
          ref={emailRef}
          id={`${id}-mail`}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="ton@email.com"
          maxLength={254}
          value={fields.email}
          onChange={update("email")}
          aria-invalid={show.email}
          aria-describedby={show.email ? `${id}-mail-err` : undefined}
          className={styles.input}
        />
        {show.email && (
          <p id={`${id}-mail-err`} className={styles.error}>
            {CONTACT_ERRORS.email}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor={`${id}-msg`} className={styles.label}>
          Message
        </label>
        <textarea
          ref={messageRef}
          id={`${id}-msg`}
          name="message"
          rows={6}
          placeholder="Parle-moi de ton projet : objectif, délai, budget si tu l’as."
          maxLength={CONTACT_LIMITS.messageMax}
          value={fields.message}
          onChange={update("message")}
          aria-invalid={show.message}
          aria-describedby={show.message ? `${id}-msg-err` : undefined}
          className={`${styles.input} ${styles.textarea}`}
        />
        {show.message && (
          <p id={`${id}-msg-err`} className={styles.error}>
            {CONTACT_ERRORS.message}
          </p>
        )}
      </div>

      {/* Pot de miel : invisible et hors du parcours clavier, ignoré par les humains. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={`${id}-site`}>Ne pas remplir ce champ</label>
        <input id={`${id}-site`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {failure && (
        <p className={styles.alert} role="alert">
          {failure === "rate_limited" ? (
            "Trop de messages envoyés depuis ta connexion. Réessaie dans une heure."
          ) : (
            <>
              L’envoi a échoué. Réessaie, ou écris-moi directement à{" "}
              <a href={`mailto:${email}`}>{email}</a>.
            </>
          )}
        </p>
      )}

      <div className={styles.submit}>
        <Button type="submit" variant="primary" size="lg" iconEnd={ArrowRight} disabled={pending}>
          {pending ? "Envoi…" : "Envoyer le message"}
        </Button>
        <span className={styles.hint}>Réponse sous {responseTime}.</span>
      </div>
    </form>
  );
}
