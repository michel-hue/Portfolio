import client from './client';
import type { Profile } from '../types';

export async function getProfile(): Promise<Profile> {
  const { data } = await client.get<Profile>('/profile');
  return data;
}

export async function updateProfile(profile: Partial<Profile>): Promise<Profile> {
  const { data } = await client.put<Profile>('/profile', profile);
  return data;
}
