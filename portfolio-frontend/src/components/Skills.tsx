import { useState } from 'react';
import type { Skill } from '../types';
import { FALLBACK_SKILL_ICON, getSkillIcon } from '../utils/skillIcons';
import Reveal from './Reveal';

interface SkillsProps {
  skills: Skill[];
  loading: boolean;
  error: string | null;
}

/** Une URL admin force l'icône ; sinon Devicon uniforme via getSkillIcon (les emojis en base sont ignorés). */
function resolveSkillIcon(skill: Skill): string {
  if (skill.icon && skill.icon.startsWith('http')) return skill.icon;
  return getSkillIcon(skill.name);
}

function SkillIcon({ skill }: { skill: Skill }) {
  const [src, setSrc] = useState(() => resolveSkillIcon(skill));
  return (
    <span className="skill-icon" aria-hidden="true">
      <img
        src={src}
        alt=""
        className="skill-icon-img"
        width={40}
        height={40}
        loading="lazy"
        onError={() => {
          if (src !== FALLBACK_SKILL_ICON) setSrc(FALLBACK_SKILL_ICON);
        }}
      />
    </span>
  );
}

export default function Skills({ skills, loading, error }: SkillsProps) {
  if (loading) {
    return (
      <section id="skills" className="skills section">
        <div className="container">
          <h2 className="section-title">Compétences</h2>
          <div className="skills-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton skeleton-card" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="skills" className="skills section">
        <div className="container">
          <h2 className="section-title">Compétences</h2>
          <p className="error-message">{error}</p>
        </div>
      </section>
    );
  }

  if (!skills || skills.length === 0) {
    return null;
  }

  // Trier par order puis grouper par catégorie
  const sorted = [...skills].sort((a, b) => a.order - b.order);

  const grouped = sorted.reduce<Record<string, Skill[]>>((acc, skill) => {
    const category = skill.category ?? 'default';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  return (
    <section id="skills" className="skills section">
      <div className="container">
        <Reveal>
          <span className="section-eyebrow">Savoir-faire</span>
          <h2 className="section-title">Compétences</h2>
          <p className="section-subtitle">Les technologies avec lesquelles je travaille</p>
        </Reveal>

        {categories.length === 1 ? (
          <div className="skills-grid">
            {grouped[categories[0]].map((skill, index) => (
              <Reveal
                key={skill.name}
                className="skill-card"
                delay={(index % 8) * 60}
              >
                <SkillIcon skill={skill} />
                <span className="skill-name">{skill.name}</span>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="skills-categories">
            {categories.map((category) => (
              <div key={category} className="skills-category">
                <Reveal>
                  <h3 className="skills-category-title">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </h3>
                </Reveal>
                <div className="skills-grid">
                  {grouped[category].map((skill, index) => (
                    <Reveal
                      key={skill.name}
                      className="skill-card"
                      delay={(index % 8) * 60}
                    >
                      <SkillIcon skill={skill} />
                      <span className="skill-name">{skill.name}</span>
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
