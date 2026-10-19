import client from './client';

/* ---------- Types ---------- */

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

/* ---------- API ---------- */

export async function getMessages(): Promise<ContactMessage[]> {
  const { data } = await client.get<ContactMessage[]>('/contact');
  return data;
}

export async function markAsRead(id: number): Promise<ContactMessage> {
  const { data } = await client.patch<ContactMessage>(`/contact/${id}/read`);
  return data;
}
