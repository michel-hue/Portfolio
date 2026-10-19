export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-container">
        <p className="footer-brand">
          <span className="footer-brand-dot" aria-hidden="true" />
          Portfolio
        </p>
        <nav className="footer-nav" aria-label="Navigation pied de page">
          <a href="#hero" className="footer-link">Accueil</a>
          <a href="#skills" className="footer-link">Compétences</a>
          <a href="#projects" className="footer-link">Projets</a>
          <a href="#contact" className="footer-link">Contact</a>
        </nav>
        <p className="footer-text">
          © {year} — Développé avec <span className="footer-heart">♥</span> en
          React &amp; TypeScript
        </p>
      </div>
    </footer>
  );
}
