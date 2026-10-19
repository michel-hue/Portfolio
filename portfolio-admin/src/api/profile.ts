import client from './client';

/* ---------- Types ---------- */

export interface Profile {
  id: number;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  location: string;
  skills: string[];
  updatedAt: string;
}

export interface UpdateProfilePayload {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  location: string;
  skills: string[];
}

/* ---------- API ---------- */

export async function getProfile(): Promise<Profile> {
  const { data } = await client.get<Profile>('/profile');
  return data;
}

export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<Profile> {
  const { data } = await client.put<Profile>('/profile', payload);
  return data;
}
