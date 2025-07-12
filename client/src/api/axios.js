// src/api/axios.js
import axios from 'axios';
import { getStoredAuth, clearStoredAuth } from '../utils/authHelpers';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 15000,
});
console.log('[DEBUG] Axios base URL:', api.defaults.baseURL);

// REQUEST INTERCEPTOR: Inject Bearer Token if available
api.interceptors.request.use(
  (config) => {
    const auth = getStoredAuth();
    if (auth?.token) {
      console.log('[DEBUG] Attaching token to headers:', auth.token);
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// RESPONSE INTERCEPTOR: Handle Unauthorized or Forbidden
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      console.warn(`[axios] Token rejected (status: ${status}). Clearing auth.`);
      clearStoredAuth();

      // Optional: Avoid redirect loop if already on sign-in
      if (!window.location.pathname.includes('/signin')) {
        window.location.href = '/signin';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
