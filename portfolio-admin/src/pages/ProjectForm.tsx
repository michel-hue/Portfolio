import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  createProject,
  getProject,
  updateProject,
} from '../api/projects';
import { uploadImage } from '../api/upload';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast, { useToasts } from '../components/Toast';

interface FormState {
  title: string;
  description: string;
  image: string;
  technologies: string;
  githubUrl: string;
  demoUrl: string;
  featured: boolean;
  order: string;
}

const EMPTY_FORM: FormState = {
  title: '',
  description: '',
  image: '',
  technologies: '',
  githubUrl: '',
  demoUrl: '',
  featured: false,
  order: '0',
};

export default function ProjectForm() {
  const { id: rawId } = useParams<{ id: string }>();
  const id = rawId ? Number(rawId) : undefined;
  const isEdit = id !== undefined;
  const navigate = useNavigate();
  const { toasts, dismiss, success, error: toastError } = useToasts();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Charger le projet existant en mode édition
  useEffect(() => {
    if (!id) return;
    const projectId = id;
    let cancelled = false;

    async function load() {
      try {
        const project = await getProject(projectId);
        if (cancelled) return;
        setForm({
          title: project.title,
          description: project.description,
          image: project.image,
          technologies: project.technologies.join(', '),
          githubUrl: project.githubUrl,
          demoUrl: project.demoUrl,
          featured: project.featured,
          order: String(project.order),
        });
      } catch {
        if (!cancelled) {
          toastError('Impossible de charger le projet.');
          navigate('/projects');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, navigate, toastError]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Efface l'erreur du champ quand on le corrige
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Réinitialise l'input pour permettre de re-sélectionner le même fichier
    e.target.value = '';
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((prev) => ({ ...prev, image: url }));
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.image;
        return next;
      });
    } catch {
      toastError("Échec de l'upload de l'image.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, image: '' }));
  };

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.title.trim()) errors.title = 'Le titre est requis.';
    if (!form.description.trim())
      errors.description = 'La description est requise.';
    if (form.image && !/^https?:\/\/.+/.test(form.image))
      errors.image = "L'URL de l'image doit commencer par http(s)://";
    if (form.githubUrl && !/^https?:\/\/.+/.test(form.githubUrl))
      errors.githubUrl = "L'URL GitHub doit commencer par http(s)://";
    if (form.demoUrl && !/^https?:\/\/.+/.test(form.demoUrl))
      errors.demoUrl = "L'URL de démo doit commencer par http(s)://";
    if (form.order && isNaN(Number(form.order)))
      errors.order = "L'ordre doit être un nombre.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      technologies: form.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      githubUrl: form.githubUrl.trim(),
      demoUrl: form.demoUrl.trim(),
      featured: form.featured,
      order: Number(form.order) || 0,
    };

    try {
      if (isEdit && id) {
        await updateProject(id, payload);
        success('Projet modifié avec succès.');
      } else {
        await createProject(payload);
        success('Projet créé avec succès.');
      }
      navigate('/projects');
    } catch {
      toastError(
        isEdit
          ? 'Échec de la modification du projet.'
          : 'Échec de la création du projet.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <LoadingSpinner label="Chargement du projet..." />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Toast toasts={toasts} onDismiss={dismiss} />

      <div className="page-header">
        <div>
          <h1 className="page-title">
            {isEdit ? 'Modifier le projet' : 'Nouveau projet'}
          </h1>
          <p className="page-subtitle">
            {isEdit
              ? 'Mettez à jour les informations du projet.'
              : 'Ajoutez un nouveau projet à votre portfolio.'}
          </p>
        </div>
        <Link to="/projects" className="btn btn-secondary">
          Retour
        </Link>
      </div>

      <div className="card form-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="title">Titre *</label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Nom du projet"
            />
            {fieldErrors.title && (
              <div className="field-error">{fieldErrors.title}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Décrivez le projet..."
              rows={4}
            />
            {fieldErrors.description && (
              <div className="field-error">{fieldErrors.description}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="image">Image</label>
            <input
              ref={fileInputRef}
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="image-input-hidden"
            />

            {uploading ? (
              <div className="image-uploading">
                <LoadingSpinner size="sm" label="Upload en cours..." />
              </div>
            ) : form.image ? (
              <div className="image-preview">
                <img src={form.image} alt="Aperçu du projet" />
                <div className="image-preview-actions">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleOpenFilePicker}
                  >
                    Remplacer
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={handleRemoveImage}
                  >
                    Retirer
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="image-dropzone"
                onClick={handleOpenFilePicker}
              >
                <span className="image-dropzone-text">
                  Choisir une image
                </span>
                <span className="image-dropzone-hint">
                  Cliquez pour parcourir vos fichiers
                </span>
              </button>
            )}
            {fieldErrors.image && (
              <div className="field-error">{fieldErrors.image}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="technologies">Technologies</label>
            <input
              id="technologies"
              name="technologies"
              value={form.technologies}
              onChange={handleChange}
              placeholder="React, TypeScript, Node.js"
            />
            <div className="form-hint">
              Séparez les technologies par des virgules.
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="githubUrl">GitHub URL</label>
              <input
                id="githubUrl"
                name="githubUrl"
                value={form.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/user/repo"
              />
              {fieldErrors.githubUrl && (
                <div className="field-error">{fieldErrors.githubUrl}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="demoUrl">Demo URL</label>
              <input
                id="demoUrl"
                name="demoUrl"
                value={form.demoUrl}
                onChange={handleChange}
                placeholder="https://demo.example.com"
              />
              {fieldErrors.demoUrl && (
                <div className="field-error">{fieldErrors.demoUrl}</div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="order">Ordre d'affichage</label>
              <input
                id="order"
                name="order"
                type="number"
                value={form.order}
                onChange={handleChange}
                placeholder="0"
              />
              {fieldErrors.order && (
                <div className="field-error">{fieldErrors.order}</div>
              )}
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                />
                <span>Projet en vedette</span>
              </label>
              <div className="form-hint">
                Les projets en vedette sont mis en avant sur le portfolio.
              </div>
            </div>
          </div>

          <div className="form-actions">
            <Link to="/projects" className="btn btn-secondary">
              Annuler
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting
                ? 'Enregistrement...'
                : isEdit
                  ? 'Enregistrer les modifications'
                  : 'Créer le projet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
