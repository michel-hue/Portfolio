import client from './client';

interface UploadResponse {
  url: string;
}

/**
 * Upload une image vers le serveur et retourne l'URL publique du fichier.
 * Le token JWT est injecté automatiquement par l'intercepteur du client axios.
 */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await client.post<UploadResponse>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data.url;
}
