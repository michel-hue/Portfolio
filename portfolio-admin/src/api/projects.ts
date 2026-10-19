import client from './client';

/* ---------- Types ---------- */

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  demoUrl: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  demoUrl: string;
  featured: boolean;
  order: number;
}

export type UpdateProjectPayload = Partial<CreateProjectPayload>;

/* ---------- API ---------- */

export async function getProjects(): Promise<Project[]> {
  const { data } = await client.get<Project[]>('/projects');
  return data;
}

export async function getProject(id: number): Promise<Project> {
  const { data } = await client.get<Project>(`/projects/${id}`);
  return data;
}

export async function createProject(
  payload: CreateProjectPayload,
): Promise<Project> {
  const { data } = await client.post<Project>('/projects', payload);
  return data;
}

export async function updateProject(
  id: number,
  payload: UpdateProjectPayload,
): Promise<Project> {
  const { data } = await client.put<Project>(`/projects/${id}`, payload);
  return data;
}

export async function deleteProject(id: number): Promise<void> {
  await client.delete(`/projects/${id}`);
}
