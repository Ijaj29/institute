import axios, { type InternalAxiosRequestConfig } from 'axios';
import { sessionService } from '@/services/sessionService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/';

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attaches the JWT saved after login to every outgoing request.
httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = sessionService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — on 401 (expired/invalid token), clear session and bounce to login.
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionService.clear();
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  },
);