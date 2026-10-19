import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';

const NAV_LINKS = [
  { href: '#hero', label: 'Accueil' },
  { href: '#skills', label: 'Compétences' },
  { href: '#projects', label: 'Projets' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleScrollSpy = () => {
      const sections = NAV_LINKS.map((link) => link.href.slice(1));
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const { offsetTop, offsetHeight } = el;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScrollSpy);
    handleScroll();
    handleScrollSpy();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScrollSpy);
    };
  }, []);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <nav className="navbar-container container">
        <a href="#hero" className="navbar-logo" onClick={handleLinkClick}>
          <span className="navbar-logo-dot" aria-hidden="true" />
          <span className="navbar-logo-text">Portfolio</span>
        </a>

        <ul className={`navbar-links ${menuOpen ? 'navbar-links-open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`navbar-link ${
                  activeSection === link.href.slice(1) ? 'navbar-link-active' : ''
                }`}
                onClick={handleLinkClick}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          <ThemeToggle />
          <button
            type="button"
            className="navbar-burger"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className={`burger-line ${menuOpen ? 'burger-line-open' : ''}`} />
            <span className={`burger-line ${menuOpen ? 'burger-line-open' : ''}`} />
            <span className={`burger-line ${menuOpen ? 'burger-line-open' : ''}`} />
          </button>
        </div>
      </nav>
    </header>
  );
}
