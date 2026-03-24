import axios from 'axios';
import { finmindStorageKey } from '../hooks/useLocalStorage';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

function readStoredAuthToken(): string | null {
  const raw = localStorage.getItem(finmindStorageKey('auth_token'));
  if (raw == null) return null;
  try {
    const v = JSON.parse(raw) as unknown;
    return typeof v === 'string' && v.length > 0 ? v : null;
  } catch {
    return null;
  }
}

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

apiClient.interceptors.request.use((config) => {
  const token = readStoredAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err),
);
