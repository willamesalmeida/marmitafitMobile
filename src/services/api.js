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
import { Alert } from "react-native";

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

    console.log("API Error:", {
      status,
      url: originalRequest.url,
      message: error.message,
    });

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refresh = await getRefreshToken();
        if (!refresh) {
          console.log("refresh token não encontrado");
          throw new Error("No refresh token available");
        }

        console.log('tentando refresh token')

        // chama authService.refreshToken que deve retornar { accessToken, refreshToken }
        const r = await refreshTokenService(refresh);
        const newAccessToken = r.accessToken || r.data?.accessToken;
        const newRefreshToken = r.refreshToken || r.data?.refreshToken;
        if(!newAccessToken){
          throw new Error('No new access token received')
        }
        console.log('refresh sucesso! Novo access token:', newAccessToken.substring(0, 20) + '...')

        await setAccessToken(newAccessToken)
        if (newRefreshToken) await setRefreshToken(newRefreshToken);

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {

        console.error('Refresh falhou', err.message)
        processQueue(err, null);

        await clearTokens();

        Alert.alert('Sessão expirada', 'Por favor, faça login novamente')
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
