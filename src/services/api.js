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

const API_URL = process.env.API_URL || "http://192.168.5.111:3333"; // <-- ajuste para o IP do seu backend

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
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getAccessToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      if (__DEV__) console.warn("[api] falha ao obter access token", error);
    }
    return config;
  },
  (err) => Promise.reject(err),
);

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

    if (__DEV__) {
      console.log("API Error:", {
        status,
        url: originalRequest.url,
        message: error.message,
      });
    }

    // Trata erros 401 (Unauthorized) - access token expirado ou inválido
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Se a requisição que falhou é o próprio endpoint de refresh, não tenta refresh novamente
      if (originalRequest.url?.includes("/refresh")) {
        if (__DEV__) console.log("[API] Refresh endpoint failed, clearing tokens");
        await clearTokens();
        return Promise.reject(error);
      }

      if (__DEV__) console.log("[API] Access token expirado. Tentando refresh...");

      if (isRefreshing) {
        // Se já está fazendo refresh, adiciona à fila
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const refresh = await getRefreshToken();
        if (!refresh) {
          throw new Error("no refresh token available");
        }

        if (__DEV__) console.log("[API] Tentando Refresh...");

        const r = await refreshTokenService(refresh);
        const newAccessToken = r.accessToken;
        const newRefreshToken = r.refreshToken;

        if (!newAccessToken) {
          throw new Error("No access token received from refresh");
        }

        await setAccessToken(newAccessToken);
        if (newRefreshToken) await setRefreshToken(newRefreshToken);

        if (__DEV__)
          console.log("[API] Refresh successful! New access token obtained.");

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);

      } catch (err) {
        // Se o refresh token está expirado ou inválido (400, 401, 403)
        const refreshStatus = err.response?.status;
        if (refreshStatus === 400 || refreshStatus === 401 || refreshStatus === 403) {
          if (__DEV__) {
            console.error(
              "[API] Refresh token expirado ou inválido. Status:",
              refreshStatus,
            );
          }
        } else {
          if (__DEV__) console.error("[API] Refresh failed:", err.message);
        }
        
        processQueue(err, null);
        await clearTokens();
       
        return Promise.reject(err);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
