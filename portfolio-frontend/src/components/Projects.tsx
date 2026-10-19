import { useEffect, useState } from 'react';
import { getProjects } from '../api/projects';
import type { Project } from '../types';
import ProjectCard from './ProjectCard';
import Reveal from './Reveal';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProjects();
        if (isMounted) {
          setProjects(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Impossible de charger les projets.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="projects" className="projects section">
      <div className="container">
        <Reveal>
          <span className="section-eyebrow">Réalisations</span>
          <h2 className="section-title">Projets</h2>
          <p className="section-subtitle">Une sélection de mes réalisations</p>
        </Reveal>

        {loading && (
          <div className="projects-grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton skeleton-project-card" />
            ))}
          </div>
        )}

        {error && (
          <div className="projects-error">
            <p className="error-message">{error}</p>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => window.location.reload()}
            >
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <p className="projects-empty">Aucun projet pour le moment.</p>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="projects-grid">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
