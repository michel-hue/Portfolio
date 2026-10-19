import client from './client';
import type { Skill } from '../types';

export async function getSkills(): Promise<Skill[]> {
  const { data } = await client.get<Skill[]>('/skills');
  return data;
}
