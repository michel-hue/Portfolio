import client from './client';

/* ---------- Types ---------- */

export interface Skill {
  id: number;
  name: string;
  icon?: string;
  category?: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSkillPayload {
  name: string;
  icon?: string;
  category?: string;
  order: number;
}

export type UpdateSkillPayload = Partial<CreateSkillPayload>;

/* ---------- API ---------- */

export async function getSkills(): Promise<Skill[]> {
  const { data } = await client.get<Skill[]>('/skills');
  return data;
}

export async function createSkill(payload: CreateSkillPayload): Promise<Skill> {
  const { data } = await client.post<Skill>('/skills', payload);
  return data;
}

export async function updateSkill(
  id: number,
  payload: UpdateSkillPayload,
): Promise<Skill> {
  const { data } = await client.put<Skill>(`/skills/${id}`, payload);
  return data;
}

export async function deleteSkill(id: number): Promise<void> {
  await client.delete(`/skills/${id}`);
}
