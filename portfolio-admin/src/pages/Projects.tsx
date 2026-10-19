import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteProject, getProjects, type Project } from '../api/projects';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast, { useToasts } from '../components/Toast';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toasts, dismiss, success, error: toastError } = useToasts();

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch {
      setError('Impossible de charger les projets.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProject(deleteTarget.id);
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      success('Projet supprimé avec succès.');
      setDeleteTarget(null);
    } catch {
      toastError('Échec de la suppression du projet.');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="animate-fade-in">
      <Toast toasts={toasts} onDismiss={dismiss} />

      <div className="page-header">
        <div>
          <h1 className="page-title">Projets</h1>
          <p className="page-subtitle">
            Gérez les projets affichés sur votre portfolio.
          </p>
        </div>
        <Link to="/projects/new" className="btn btn-primary">
          + Nouveau projet
        </Link>
      </div>

      {loading ? (
        <div className="page-loading">
          <LoadingSpinner label="Chargement des projets..." />
        </div>
      ) : error ? (
        <div className="error-banner">
          {error}
          <button className="btn btn-sm btn-secondary mt-sm" onClick={loadProjects}>
            Réessayer
          </button>
        </div>
      ) : projects.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-title">Aucun projet</div>
            <div className="empty-state-text">
              Aucun projet pour le moment.
              <br />
              Cliquez sur « Nouveau projet » pour commencer.
            </div>
            <Link to="/projects/new" className="btn btn-primary mt-md">
              Nouveau projet
            </Link>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Projet</th>
                  <th>Technologies</th>
                  <th>Vedette</th>
                  <th>Ordre</th>
                  <th>Créé le</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <div className="project-cell">
                        {project.image && (
                          <img
                            src={project.image}
                            alt={project.title}
                            className="project-thumb"
                          />
                        )}
                        <div>
                          <div className="project-title">{project.title}</div>
                          <div className="project-desc text-muted text-sm">
                            {project.description.length > 60
                              ? `${project.description.slice(0, 60)}...`
                              : project.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="tag-list">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span key={tech} className="tag">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="tag">+{project.technologies.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      {project.featured ? (
                        <span className="badge badge-accent">Vedette</span>
                      ) : (
                        <span className="badge badge-muted">—</span>
                      )}
                    </td>
                    <td className="text-muted">{project.order}</td>
                    <td className="text-muted text-sm">
                      {formatDate(project.createdAt)}
                    </td>
                    <td>
                      <div className="flex gap-sm">
                        <Link
                          to={`/projects/${project.id}/edit`}
                          className="btn btn-sm btn-secondary"
                        >
                          Modifier
                        </Link>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => setDeleteTarget(project)}
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

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Supprimer ce projet ?"
        message={`Êtes-vous sûr de vouloir supprimer « ${deleteTarget?.title} » ? Cette action est irréversible.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
