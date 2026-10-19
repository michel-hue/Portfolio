import { useCallback, useEffect, useState } from 'react';
import {
  createSkill,
  deleteSkill,
  getSkills,
  updateSkill,
  type Skill,
} from '../api/skills';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast, { useToasts } from '../components/Toast';

const CATEGORIES = ['Frontend', 'Backend', 'Mobile', 'DevOps', 'Outils', 'Autre'];

interface SkillFormState {
  name: string;
  icon: string;
  category: string;
  order: string;
}

const EMPTY_FORM: SkillFormState = {
  name: '',
  icon: '',
  category: '',
  order: '0',
};

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Formulaire (création / édition)
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState<SkillFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { toasts, dismiss, success, error: toastError } = useToasts();

  const loadSkills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSkills();
      setSkills(data);
    } catch {
      setError('Impossible de charger les compétences.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (skill: Skill) => {
    setEditing(skill);
    setForm({
      name: skill.name,
      icon: skill.icon ?? '',
      category: skill.category ?? '',
      order: String(skill.order),
    });
    setFormError(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;
    setFormOpen(false);
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError(null);
  };

  const handleFieldChange = (
    field: keyof SkillFormState,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) {
      setFormError('Le nom de la compétence est requis.');
      return;
    }

    const order = Number(form.order);
    if (Number.isNaN(order)) {
      setFormError("L'ordre doit être un nombre.");
      return;
    }

    const payload = {
      name,
      icon: form.icon.trim() || undefined,
      category: form.category || undefined,
      order,
    };

    setSaving(true);
    setFormError(null);
    try {
      if (editing) {
        const updated = await updateSkill(editing.id, payload);
        setSkills((prev) =>
          prev.map((s) => (s.id === updated.id ? updated : s)),
        );
        success('Compétence modifiée avec succès.');
      } else {
        const created = await createSkill(payload);
        setSkills((prev) => [...prev, created]);
        success('Compétence créée avec succès.');
      }
      closeForm();
    } catch {
      toastError(
        editing
          ? 'Échec de la modification de la compétence.'
          : 'Échec de la création de la compétence.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteSkill(deleteTarget.id);
      setSkills((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      success('Compétence supprimée avec succès.');
      setDeleteTarget(null);
    } catch {
      toastError('Échec de la suppression de la compétence.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <Toast toasts={toasts} onDismiss={dismiss} />

      <div className="page-header">
        <div>
          <h1 className="page-title">Compétences</h1>
          <p className="page-subtitle">
            Gérez les compétences affichées sur votre portfolio.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + Nouvelle compétence
        </button>
      </div>

      {loading ? (
        <div className="page-loading">
          <LoadingSpinner label="Chargement des compétences..." />
        </div>
      ) : error ? (
        <div className="error-banner">
          {error}
          <button
            className="btn btn-sm btn-secondary mt-sm"
            onClick={loadSkills}
          >
            Réessayer
          </button>
        </div>
      ) : skills.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-title">Aucune compétence</div>
            <div className="empty-state-text">
              Aucune compétence pour le moment.
              <br />
              Cliquez sur « Nouvelle compétence » pour commencer.
            </div>
            <button className="btn btn-primary mt-md" onClick={openCreate}>
              Nouvelle compétence
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Compétence</th>
                  <th>Catégorie</th>
                  <th>Ordre</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {skills.map((skill) => (
                  <tr key={skill.id}>
                    <td>
                      <div className="skill-cell">
                        {skill.icon && (
                          <span className="skill-icon">{skill.icon}</span>
                        )}
                        <span className="skill-name">{skill.name}</span>
                      </div>
                    </td>
                    <td>
                      {skill.category ? (
                        <span className="badge badge-accent">
                          {skill.category}
                        </span>
                      ) : (
                        <span className="badge badge-muted">—</span>
                      )}
                    </td>
                    <td className="text-muted">{skill.order}</td>
                    <td>
                      <div className="flex gap-sm">
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => openEdit(skill)}
                        >
                          Modifier
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => setDeleteTarget(skill)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Formulaire création / édition */}
      {formOpen && (
        <div className="modal-overlay" onClick={saving ? undefined : closeForm}>
          <div
            className="modal modal-form"
            role="dialog"
            aria-modal="true"
            aria-labelledby="skill-form-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="skill-form-title" className="modal-title">
              {editing ? 'Modifier la compétence' : 'Nouvelle compétence'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="skill-name">Nom *</label>
                <input
                  id="skill-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  placeholder="Ex : React, TypeScript, Docker..."
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="skill-icon">Icône</label>
                <input
                  id="skill-icon"
                  type="text"
                  value={form.icon}
                  onChange={(e) => handleFieldChange('icon', e.target.value)}
                  placeholder="Ex : React, Docker, TS..."
                />
                <div className="form-hint">
                  Nom ou classe d'icône (optionnel).
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="skill-category">Catégorie</label>
                <select
                  id="skill-category"
                  value={form.category}
                  onChange={(e) =>
                    handleFieldChange('category', e.target.value)
                  }
                >
                  <option value="">— Aucune —</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="skill-order">Ordre</label>
                <input
                  id="skill-order"
                  type="number"
                  value={form.order}
                  onChange={(e) => handleFieldChange('order', e.target.value)}
                  placeholder="0"
                />
                <div className="form-hint">
                  Plus le nombre est petit, plus la compétence apparaît en
                  premier.
                </div>
              </div>

              {formError && <div className="field-error">{formError}</div>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? 'Enregistrement...'
                    : editing
                      ? 'Enregistrer'
                      : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Supprimer cette compétence ?"
        message={`Êtes-vous sûr de vouloir supprimer « ${deleteTarget?.name} » ? Cette action est irréversible.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
