import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import * as Device from "expo-device";
import {
  setAccessToken,
  setRefreshToken,
  getDeviceId,
  setDeviceId,
  clearTokens,
} from "./secureStore";

const API_URL = process.env.API_URL || "http://192.168.5.111:3333";

//garante que exista um deviceId salvo no securestore
const ensureDeviceId = async () => {
  let id = await getDeviceId();
  if (!id) {
    try {
      if (Device && Device.osInternalBuildId) {
        id = `${Device.osName || "device"}-${Device.osInternalBuildId}`;
      } else {
        id = uuidv4();
      }

      // Limpa caracteres que estão sujando o token
      id = id
        .replace(/\./g, "-") // Troca pontos por hífens
        .replace(/\//g, "-") // Troca barras por hífens
        .replace(/:/g, "-") // Troca dois-pontos por hífens
        .substring(0, 100); // Limita tamanho
    } catch (error) {
      id = uuidv4();
    }
    await setDeviceId(id);
  }
  return id;
};
// função para fazer login: chama login, salva os tokens e retorna os dados
export const login = async (email, password) => {
  try {
    const deviceId = await ensureDeviceId();
    const response = await axios.post(
      `${API_URL}/login`,
      {
        email,
        password,
        deviceId,
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      },
    );

    const { accessToken, refreshToken, user } = response.data;

    if (accessToken) {
      await setAccessToken(accessToken);
    }
    if (refreshToken) {
      await setRefreshToken(refreshToken);
    }
    if (__DEV__)
      console.log("[AuthService] login successful and Tokens saved.");

    return { success: true, data: { accessToken, refreshToken, user } };
  } catch (error) {
    if (__DEV__) console.error("[AuthService] Error:", error.message);
    const message =
      error.response?.data?.message || error.message || "Login error";
    return { success: false, message };
  }

  //   //O back pode retornar { success: true, data: {accesstoken, refreshtoken, user}}
  //   const payload = response.data;
  //   const data = payload.success ? payload.data : payload;

  //   const accessToken = data.accessToken || data.access_token;
  //   const refreshToken = data.refreshToken || data.refresh_Token;

  //   if (accessToken) await setAccessToken(accessToken);
  //   if (refreshToken) await setRefreshToken(refreshToken);

  //   if (accessToken) {
  //     await setAccessToken(accessToken);
  //     console.log(
  //       "✅ ACCESS TOKEN SALVO COM SUCESSO:",
  //       accessToken.substring(0, 50) + "..."
  //     );
  //   }

  //   if (refreshToken) {
  //     await setRefreshToken(refreshToken);
  //     console.log(
  //       "✅ REFRESH TOKEN SALVO COM SUCESSO:",
  //       refreshToken.substring(0, 50) + "..."
  //     );
  //   }

  //   return { success: true, data };
  // } catch (error) {
  //   const message =
  //     error.response?.data?.message ||
  //     (error.response?.data?.details &&
  //       error.response.data.details.join(" | ")) ||
  //     error.message ||
  //     "Login error";

  //   return { success: false, message };
  // }
};








// Função chamada pelo api.js quando precisar trocar refresh -> access // IMPORTANTE: não usa a instância api para evitar import circular
export const refreshToken = async (refreshTokenValue) => {
  try {
    console.log("🔍 Refresh token VALUE:", refreshTokenValue);
    console.log(
      "   Contém pontos extras?:",
      (refreshTokenValue.match(/\./g) || []).length > 2,
    );

    const deviceId = await ensureDeviceId();

    console.log("📤 Enviando para backend:", {
      refreshTokenLength: refreshTokenValue.length,
      deviceIdLength: deviceId.length,
      deviceIdPreview: deviceId.substring(0, 50),
    });

    const response = await axios.post(
      `${API_URL}/refresh`,
      {
        refreshToken: refreshTokenValue,
        deviceId,
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      },
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    if (accessToken) await setAccessToken(accessToken);
    if (newRefreshToken) await setRefreshToken(newRefreshToken);
    if (__DEV__)
      console.log("[AuthService] refresh successful! New access token.");

    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    await clearTokens();
    throw error;
  }
  //   const payload = response.data;
  //   const data = payload.success ? payload.data : payload;

  //   const newAccessToken = data.accessToken || data.access_Token;
  //   const newRefreshToken = data.refreshToken || data.refresh_Token;

  //   if (newAccessToken) await setAccessToken(newAccessToken);
  //   if (newRefreshToken) await setRefreshToken(newRefreshToken);

  //   //retorn os tokens no formato simples para o api.js
  //   return { accessToken: newAccessToken, refreshToken: newRefreshToken, data };
  // } catch (error) {
  //   //se o refresh falhar, limpa os token locais
  //   await clearTokens();
  //   const message =
  //     error.response?.data?.message ||
  //     (error.response?.data?.details &&
  //       error.response.data.details.join(" | ")) ||
  //     error.message ||
  //     "Refresh token error";

  //   //lança o erro paa a api.js tratar a fila e limpar os tokens
  //   const err = new Error(message);
  //   err.original = error;
  //   throw err;
  // }
};

//logou: avisa pro back e limpa os tokens locais
export const logout = async (refreshTokenValue) => {
  try {
    await axios.post(
      `${API_URL}/logout`,
      { refreshToken: refreshTokenValue },
      { headers: { "Content-Type": "application/json" }, timeout: 10000 },
    );
  } catch (e) {
    // ignoramos erros do servidor no logout, mas sempre limpamos localmente
  } finally {
    await clearTokens();
  }
};
