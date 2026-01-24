import React, { createContext, useState, useEffect, useContext } from "react";
import * as SecureStore from "../services/secureStore";
import * as authService from "../services/authService";
import api from "../services/api";

//cria o contexto
const AuthContext = createContext({});

//chama o provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function LoadStorageData() {
      try {
        setLoading(true);
        const storageToken = await SecureStore.getAccessToken();

        if (storageToken) {
          api.defaults.headers.common["Authorization"] =
            `Bearer ${storageToken}`;

          try {
            const response = await api.get("/me");

            setUser(response.data.user || response.data); //Marca como logado temporatiamente
          } catch (error) {
            console.log(
              "Sessão expirada no boot. Limpando estado...",
              error.message,
            );
            await SecureStore.clearTokens();
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados do armazenamento", error);
      } finally {
        setLoading(false);
      }
    }

    LoadStorageData();
  }, []);

  const logout = async () => {
    try {
      const refreshTokenValue = await SecureStore.getRefreshToken();

      if (refreshTokenValue) {
        await authService.logout(refreshTokenValue); //chama a api para invalidar o refresh token
      }
    } catch (error) {
      console.log("Erro ao avisar logouut na API:", error);
    } finally {
      await SecureStore.clearTokens();
      // remove o token do header global no logout
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, setUser, loading, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
