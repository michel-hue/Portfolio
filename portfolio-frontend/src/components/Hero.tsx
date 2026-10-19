import type { Profile } from '../types';

interface HeroProps {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

export default function Hero({ profile, loading, error }: HeroProps) {
  // Fond style Nest (CSS pur) via la classe "hero-paint" (voir components.css).
  const heroClassName = 'hero section hero-paint';

  if (loading) {
    return (
      <section id="hero" className={heroClassName}>
        <div className="container hero-loading">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-subtitle" />
          <div className="skeleton skeleton-text" />
        </div>
      </section>
    );
  }

  if (error || !profile) {
    return (
      <section id="hero" className={heroClassName}>
        <div className="container hero-error">
          <p className="error-message">
            {error ?? 'Impossible de charger le profil.'}
          </p>
        </div>
      </section>
    );
  }

  const { name, title, bio, socialLinks } = profile;

  return (
    <section id="hero" className={heroClassName}>
      <div className="container hero-container">
        <div className="hero-content">
          <p className="hero-greeting">
            Bonjour, je suis
          </p>
          <h1 className="hero-name">{name}</h1>
          <h2 className="hero-title">{title}</h2>
          <p className="hero-bio">{bio}</p>

          {socialLinks && socialLinks.length > 0 && (
            <div className="hero-socials">
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-social-link"
                  aria-label={link.platform}
                  title={link.platform}
                >
                  {link.icon ? (
                    <img src={link.icon} alt={link.platform} className="hero-social-icon" />
                  ) : (
                    <span className="hero-social-text">{link.platform}</span>
                  )}
                </a>
              ))}
            </div>
          )}

          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary">
              Voir mes projets
            </a>
            <a href="#contact" className="btn btn-outline">
              Me contacter
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
