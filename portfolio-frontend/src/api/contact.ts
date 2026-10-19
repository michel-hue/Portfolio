import client from './client';
import type { ContactMessage } from '../types';

export async function sendMessage(message: ContactMessage): Promise<{ success: boolean; message?: string }> {
  const { data } = await client.post<{ success: boolean; message?: string }>(
    '/contact',
    message
  );
  return data;
}
