import client from './client';
import type { Project } from '../types';

export async function getProjects(): Promise<Project[]> {
  const { data } = await client.get<Project[]>('/projects');
  return data;
}

export async function getProject(id: string): Promise<Project> {
  const { data } = await client.get<Project>(`/projects/${id}`);
  return data;
}

export async function createProject(project: Omit<Project, 'id'>): Promise<Project> {
  const { data } = await client.post<Project>('/projects', project);
  return data;
}

export async function updateProject(
  id: string,
  project: Partial<Project>
): Promise<Project> {
  const { data } = await client.put<Project>(`/projects/${id}`, project);
  return data;
}

export async function deleteProject(id: string): Promise<void> {
  await client.delete(`/projects/${id}`);
}
