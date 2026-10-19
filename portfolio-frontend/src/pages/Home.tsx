import { useEffect, useState } from 'react';
import { getProfile } from '../api/profile';
import { getSkills } from '../api/skills';
import type { Profile, Skill } from '../types';
import Hero from '../components/Hero';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Contact from '../components/Contact';

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [skillsError, setSkillsError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        setProfileError(null);
        const data = await getProfile();
        if (isMounted) {
          setProfile(data);
        }
      } catch (err) {
        if (isMounted) {
          setProfileError(
            err instanceof Error
              ? err.message
              : 'Impossible de charger le profil.'
          );
        }
      } finally {
        if (isMounted) {
          setProfileLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchSkills = async () => {
      try {
        setSkillsLoading(true);
        setSkillsError(null);
        const data = await getSkills();
        if (isMounted) {
          setSkills(data);
        }
      } catch (err) {
        if (isMounted) {
          setSkillsError(
            err instanceof Error
              ? err.message
              : 'Impossible de charger les compétences.'
          );
        }
      } finally {
        if (isMounted) {
          setSkillsLoading(false);
        }
      }
    };

    fetchSkills();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main>
      <Hero profile={profile} loading={profileLoading} error={profileError} />
      <Skills
        skills={skills}
        loading={skillsLoading}
        error={skillsError}
      />
      <Projects />
      <Contact />
    </main>
  );
}
