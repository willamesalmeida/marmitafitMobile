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
  (err) => Promise.reject(err)
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

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        const refresh = await getRefreshToken();
        if (!refresh) {
          throw Object.assign(new Error("No refresh token available"), {
            code: "NO_REFRESH_TOKEN",
          });
        }

        if (__DEV__) console.log("tentando refresh token");

        // chama authService.refreshToken que deve retornar { accessToken, refreshToken }
        const r = await refreshTokenService(refresh);
        const newAccessToken = r.accessToken || r.data?.accessToken;
        const newRefreshToken = r.refreshToken || r.data?.refreshToken;

        if (!newAccessToken) {
          throw Object.assign(new Error("No new access token received"))
        }

        if(__DEV__) console.log("refresh sucesso! Novo access token");

        await setAccessToken(newAccessToken);
        if (newRefreshToken) await setRefreshToken(newRefreshToken);

        processQueue(null, newAccessToken);
        
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        if(__DEV__)console.error("Refresh falhou", err.message);
        processQueue(err, null);

        await clearTokens();

        // Alert.alert("Sessão expirada", "Por favor, faça login novamente");

        return Promise.reject(Object.assign(err,{code: err.code || "REFRESH_FAILED"}));
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
