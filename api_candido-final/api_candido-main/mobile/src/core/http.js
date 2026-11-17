import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

function resolveOrigin() {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/$/, '');
  if (fromEnv) return fromEnv;

  // Expo Go: reaproveita o IP do computador que está rodando o Metro.
  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri ? hostUri.split(':')[0] : null;
  if (host && Platform.OS !== 'web' && host !== 'localhost' && host !== '127.0.0.1') {
    return `http://${host}:8000`;
  }

  return Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';
}

export const API_ORIGIN = resolveOrigin();
export const API_BASE_URL = `${API_ORIGIN}/api`;

export class ApiError extends Error {
  constructor(message, { status = 0, fieldErrors = {} } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: { Accept: 'application/json' },
});

function toApiError(error) {
  if (!axios.isAxiosError(error)) {
    return new ApiError(error?.message || 'Erro inesperado.');
  }

  if (!error.response) {
    const timeout = error.code === 'ECONNABORTED';
    return new ApiError(
      timeout
        ? 'O servidor demorou demais para responder. Tente novamente.'
        : `Não foi possível conectar à API (${API_ORIGIN}). Verifique se o servidor está rodando e se o endereço está correto.`
    );
  }

  const { status, data } = error.response;
  const fieldErrors = {};

  if (status === 422 && data?.errors) {
    Object.entries(data.errors).forEach(([field, messages]) => {
      fieldErrors[field] = Array.isArray(messages) ? messages[0] : String(messages);
    });
    const first = Object.values(fieldErrors)[0];
    return new ApiError(first || 'Dados inválidos.', { status, fieldErrors });
  }

  if (status === 404) return new ApiError('Registro não encontrado.', { status });
  if (status >= 500) return new ApiError('Erro interno no servidor. Tente novamente em instantes.', { status });

  return new ApiError(data?.message || 'Não foi possível concluir a operação.', { status });
}

http.interceptors.response.use((response) => response, (error) => Promise.reject(toApiError(error)));

export function photoUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}/storage/${path.replace(/^\/+/, '')}`;
}
