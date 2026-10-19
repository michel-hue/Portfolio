import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, type Project } from '../api/projects';
import { getMessages, type ContactMessage } from '../api/contact';
import { getProfile, type Profile } from '../api/profile';
import { getSkills } from '../api/skills';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

interface Stats {
  projects: number;
  featured: number;
  messages: number;
  unread: number;
  skills: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    featured: 0,
    messages: 0,
    unread: 0,
    skills: 0,
  });
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [projects, messages, profileData, skills] = await Promise.all([
          getProjects(),
          getMessages(),
          getProfile(),
          getSkills(),
        ]);

        if (cancelled) return;

        setStats({
          projects: projects.length,
          featured: projects.filter((p: Project) => p.featured).length,
          messages: messages.length,
          unread: messages.filter((m: ContactMessage) => !m.read).length,
          skills: skills.length,
        });
        setProfile(profileData);
      } catch (err) {
        if (!cancelled) {
          setError('Impossible de charger les données du dashboard.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="page-loading">
        <LoadingSpinner label="Chargement du dashboard..." />
      </div>
    );
  }

  if (error) {
    return <div className="error-banner">{error}</div>;
  }

  const statCards = [
    {
      label: 'Projets',
      value: stats.projects,
      to: '/projects',
      accent: 'accent',
    },
    {
      label: 'Projets en vedette',
      value: stats.featured,
      to: '/projects',
      accent: 'success',
    },
    {
      label: 'Messages',
      value: stats.messages,
      to: '/messages',
      accent: 'muted',
    },
    {
      label: 'Messages non lus',
      value: stats.unread,
      to: '/messages',
      accent: stats.unread > 0 ? 'danger' : 'muted',
    },
    {
      label: 'Compétences',
      value: stats.skills,
      to: '/skills',
      accent: 'accent',
    },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="page-title">
        Bonjour, {user?.name || 'Admin'}
      </h1>
      <p className="page-subtitle">
        Voici un aperçu de votre portfolio.
      </p>

      <div className="stats-grid">
        {statCards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className={`stat-card stat-card-${card.accent}`}
          >
            <div className="stat-card-value">{card.value}</div>
            <div className="stat-card-label">{card.label}</div>
          </Link>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Actions rapides</h2>
          </div>
          <div className="quick-actions">
            <Link to="/projects/new" className="btn btn-primary">
              + Nouveau projet
            </Link>
            <Link to="/profile" className="btn btn-secondary">
              Modifier le profil
            </Link>
            <Link to="/messages" className="btn btn-secondary">
              Voir les messages
            </Link>
          </div>
        </div>

        {profile && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Profil</h2>
              <Link to="/profile" className="btn btn-sm btn-secondary">
                Modifier
              </Link>
            </div>
            <div className="profile-summary">
              {profile.avatar && (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="profile-summary-avatar"
                />
              )}
              <div>
                <div className="profile-summary-name">{profile.name}</div>
                <div className="profile-summary-title">{profile.title}</div>
                <div className="profile-summary-location">
                  {profile.location}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
