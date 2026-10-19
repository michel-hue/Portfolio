import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { getProfile, updateProfile, type Profile } from '../api/profile';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast, { useToasts } from '../components/Toast';

interface FormState {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  location: string;
  skills: string;
}

const EMPTY_FORM: FormState = {
  name: '',
  title: '',
  bio: '',
  avatar: '',
  email: '',
  github: '',
  linkedin: '',
  twitter: '',
  location: '',
  skills: '',
};

export default function Profile() {
  const { toasts, dismiss, success, error: toastError } = useToasts();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const profile = await getProfile();
        if (cancelled) return;
        setForm({
          name: profile.name || '',
          title: profile.title || '',
          bio: profile.bio || '',
          avatar: profile.avatar || '',
          email: profile.email || '',
          github: profile.github || '',
          linkedin: profile.linkedin || '',
          twitter: profile.twitter || '',
          location: profile.location || '',
          skills: (profile.skills || []).join(', '),
        });
      } catch {
        if (!cancelled) {
          toastError('Impossible de charger le profil.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [toastError]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = 'Le nom est requis.';
    if (!form.email.trim()) errors.email = "L'email est requis.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = "Le format de l'email est invalide.";
    if (form.avatar && !/^https?:\/\/.+/.test(form.avatar))
      errors.avatar = "L'URL de l'avatar doit commencer par http(s)://";
    if (form.github && !/^https?:\/\/.+/.test(form.github))
      errors.github = "L'URL GitHub doit commencer par http(s)://";
    if (form.linkedin && !/^https?:\/\/.+/.test(form.linkedin))
      errors.linkedin = "L'URL LinkedIn doit commencer par http(s)://";
    if (form.twitter && !/^https?:\/\/.+/.test(form.twitter))
      errors.twitter = "L'URL Twitter doit commencer par http(s)://";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const payload = {
      name: form.name.trim(),
      title: form.title.trim(),
      bio: form.bio.trim(),
      avatar: form.avatar.trim(),
      email: form.email.trim(),
      github: form.github.trim(),
      linkedin: form.linkedin.trim(),
      twitter: form.twitter.trim(),
      location: form.location.trim(),
      skills: form.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      await updateProfile(payload);
      success('Profil mis à jour avec succès.');
    } catch {
      toastError('Échec de la mise à jour du profil.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <LoadingSpinner label="Chargement du profil..." />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Toast toasts={toasts} onDismiss={dismiss} />

      <div className="page-header">
        <div>
          <h1 className="page-title">Profil</h1>
          <p className="page-subtitle">
            Modifiez les informations affichées sur votre portfolio.
          </p>
        </div>
      </div>

      <div className="card form-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Nom *</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Votre nom"
              />
              {fieldErrors.name && (
                <div className="field-error">{fieldErrors.name}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="title">Titre</label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Développeur Full-Stack"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Présentez-vous en quelques lignes..."
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="avatar">Avatar URL</label>
              <input
                id="avatar"
                name="avatar"
                value={form.avatar}
                onChange={handleChange}
                placeholder="https://example.com/avatar.png"
              />
              {fieldErrors.avatar && (
                <div className="field-error">{fieldErrors.avatar}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="contact@example.com"
              />
              {fieldErrors.email && (
                <div className="field-error">{fieldErrors.email}</div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="github">GitHub</label>
              <input
                id="github"
                name="github"
                value={form.github}
                onChange={handleChange}
                placeholder="https://github.com/username"
              />
              {fieldErrors.github && (
                <div className="field-error">{fieldErrors.github}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="linkedin">LinkedIn</label>
              <input
                id="linkedin"
                name="linkedin"
                value={form.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
              />
              {fieldErrors.linkedin && (
                <div className="field-error">{fieldErrors.linkedin}</div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="twitter">Twitter / X</label>
              <input
                id="twitter"
                name="twitter"
                value={form.twitter}
                onChange={handleChange}
                placeholder="https://twitter.com/username"
              />
              {fieldErrors.twitter && (
                <div className="field-error">{fieldErrors.twitter}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="location">Localisation</label>
              <input
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Paris, France"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="skills">Compétences</label>
            <input
              id="skills"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="React, TypeScript, Node.js"
            />
            <div className="form-hint">
              Séparez les compétences par des virgules.
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
