import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requête — ajout du token si présent
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse — gestion centralisée des erreurs
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Le serveur a répondu avec un status hors 2xx
      const { status } = error.response;
      if (status === 401) {
        localStorage.removeItem('auth_token');
      }
    } else if (error.request) {
      // La requête a été envoyée mais pas de réponse
      console.error('Erreur réseau — le serveur est peut-être indisponible.');
    } else {
      console.error('Erreur de configuration de la requête:', error.message);
    }
    return Promise.reject(error);
  }
);

export default client;
