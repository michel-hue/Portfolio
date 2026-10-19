import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { sendMessage } from '../api/contact';
import type { ContactMessage } from '../types';
import Reveal from './Reveal';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const INITIAL_FORM: FormState = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

/** À ajuster avec les vraies coordonnées de Manuel. */
const CONTACT_EMAIL = 'contact@manuel-dev.fr';
const GITHUB_URL = 'https://github.com/';
const LINKEDIN_URL = 'https://www.linkedin.com/';

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V8h4v2a6 6 0 0 1 2-2z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function Contact() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage(null);

    const payload: ContactMessage = {
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    };

    try {
      await sendMessage(payload);
      setStatus('success');
      setForm(INITIAL_FORM);
    } catch (err) {
      setStatus('error');
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de l'envoi du message."
      );
    }
  };

  const isSubmitting = status === 'submitting';

  return (
    <section id="contact" className="contact section">
      <div className="container contact-container contact-container-wide">
        <div className="contact-grid">
          <Reveal className="contact-intro">
            <span className="section-eyebrow">Collaborons</span>
            <h2 className="section-title contact-intro-title">Contact</h2>
            <p className="section-subtitle contact-intro-text">
              Une question, un projet ? N'hésitez pas à me contacter.
              Décrivez votre besoin via le formulaire — je vous réponds
              rapidement, avec un premier avis concret sur votre projet.
            </p>

            <ul className="contact-direct">
              <li>
                <a className="contact-direct-item" href={`mailto:${CONTACT_EMAIL}`}>
                  <span className="contact-direct-icon" aria-hidden="true">
                    <MailIcon />
                  </span>
                  <span className="contact-direct-body">
                    <span className="contact-direct-label">Email</span>
                    <span className="contact-direct-value">{CONTACT_EMAIL}</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  className="contact-direct-item"
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="contact-direct-icon" aria-hidden="true">
                    <GithubIcon />
                  </span>
                  <span className="contact-direct-body">
                    <span className="contact-direct-label">GitHub</span>
                    <span className="contact-direct-value">Voir mes projets</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  className="contact-direct-item"
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="contact-direct-icon" aria-hidden="true">
                    <LinkedinIcon />
                  </span>
                  <span className="contact-direct-body">
                    <span className="contact-direct-label">LinkedIn</span>
                    <span className="contact-direct-value">Connectons-nous</span>
                  </span>
                </a>
              </li>
            </ul>

            <p className="contact-availability">
              <span className="contact-availability-dot" aria-hidden="true" />
              Disponible pour missions freelance
            </p>
          </Reveal>

          <Reveal delay={120} className="contact-card-wrap">
            <div className="contact-card contact-card-refined">
              {status === 'success' ? (
                <div className="contact-success animate-fade-in">
                  <div className="contact-success-icon" aria-hidden="true">
                    <CheckIcon />
                  </div>
                  <h3>Message envoyé</h3>
                  <p>Merci pour votre message, je vous répondrai rapidement.</p>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setStatus('idle')}
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="contact-form-row">
                    <div className="contact-form-group">
                      <label htmlFor="name" className="contact-form-label">
                        Nom
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        className="contact-form-input"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Votre nom"
                        required
                        minLength={2}
                        autoComplete="name"
                      />
                    </div>

                    <div className="contact-form-group">
                      <label htmlFor="email" className="contact-form-label">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="contact-form-input"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="vous@exemple.com"
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="contact-form-group">
                    <label htmlFor="subject" className="contact-form-label">
                      Sujet
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      className="contact-form-input"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="Sujet de votre message"
                      required
                      minLength={3}
                    />
                  </div>

                  <div className="contact-form-group">
                    <label htmlFor="message" className="contact-form-label">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      className="contact-form-input contact-form-textarea"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Votre message..."
                      required
                      minLength={10}
                      rows={6}
                    />
                  </div>

                  {status === 'error' && errorMessage && (
                    <p className="error-message contact-form-error" role="alert">
                      {errorMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary contact-form-submit contact-form-submit-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="contact-submit-loading">
                        <span className="contact-spinner" aria-hidden="true" />
                        Envoi...
                      </span>
                    ) : (
                      'Envoyer le message'
                    )}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
