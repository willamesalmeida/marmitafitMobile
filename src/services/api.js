// src/services/api.js
import axios from "axios";
import axiosRetry from "axios-retry";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from "./secureStore";
import { refreshToken as refreshTokenService } from "./authService";

const API_URL = process.env.API_URL || "http://192.168.0.100:3333"; // <-- ajuste para o IP do seu backend

const api = axios.create({
  baseURL: API_URL,
  timeout: Number(process.env.API_TIMEOUT || 10000),
  headers: { "Content-Type": "application/json" },
});

// retry para falhas transitórias
axiosRetry(api, {
  retries: 2,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) =>
    axiosRetry.isNetworkOrIdempotentRequestError(error) ||
    (error.response && error.response.status >= 500),
});

// adiciona Authorization em cada requisição
api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// fila para evitar múltiplos refresh simultâneos
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    const status = error.response?.status;
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refresh = await getRefreshToken();
        if (!refresh) throw new Error("No refresh token available");

        // chama authService.refreshToken que deve retornar { accessToken, refreshToken }
        const r = await refreshTokenService(refresh);
        const newAccessToken = r.accessToken || r.data?.accessToken;
        const newRefreshToken = r.refreshToken || r.data?.refreshToken;

        if (newAccessToken) await setAccessToken(newAccessToken);
        if (newRefreshToken) await setRefreshToken(newRefreshToken);

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        await clearTokens();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
