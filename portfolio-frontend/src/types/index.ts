export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar?: string;
  socialLinks: SocialLink[];
}

export interface Skill {
  id: number;
  name: string;
  icon?: string;
  category?: string;
  order: number;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
